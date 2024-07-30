import { useEffect, useState, useCallback, useRef } from 'react';

import { gtmEvent } from './gtm';
import { useLocation } from 'react-router-dom';

const LOCAL_STORAGE_CONSENT_KEY = 'hasAnalyticsConsent';

export enum AnalyticsConsentDecision {
    granted = 'granted',
    denied = 'denied',
}

const getConsentValue = (hasConsent: boolean) =>
    hasConsent ? AnalyticsConsentDecision.granted : AnalyticsConsentDecision.denied;

/**
 * Hook to follow user consent decision
 *
 * @param id - analitycs counter id
 * @param router
 *
 * @returns - states and callbacks
 */

export const useAnalytics = (router: any, id?: string) => {
    const analyticsRef = useRef<HTMLDivElement | null>(null);
    const [ consentValue, setConsentValue ] = useState<boolean | undefined>();
    const [ hasConsent, setHasConsent ] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const hasAnalyticsConsent = localStorage.getItem(LOCAL_STORAGE_CONSENT_KEY);

        if (hasAnalyticsConsent === null) {
            setConsentValue(Boolean(hasAnalyticsConsent));
        } else {
            setConsentValue(hasAnalyticsConsent === 'true');
            setHasConsent(true);
        }
    }, []);

    const updateConsent = useCallback(
        (result: boolean) => {
            if (!id) {
                return;
            }

            localStorage.setItem(LOCAL_STORAGE_CONSENT_KEY, String(result));

            if (window?.gtag) {
                window.gtag('consent', 'update', {
                    analytics_storage: getConsentValue(result),
                });

                window.gtag('config', id, { page_path: location.pathname });
            }

            setConsentValue(result);
            setHasConsent(true);

            gtmEvent({ action: 'updateConsent' });

            if (result) {
                gtmEvent({ action: 'cookie_consent_statistics' });
            }
        },
        [ id, location ],
    );

    useEffect(() => {
        if (!id) {
            return;
        }

        window?.gtag?.('config', id, { page_path: location.pathname });

    }, [ id ]);

    return {
        consentValue,
        hasConsent,
        updateConsent,
        analyticsRef,
    };
};