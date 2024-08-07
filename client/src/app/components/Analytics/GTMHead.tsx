import React, { useEffect } from 'react';
import { gtmId, nonce } from '~/configs/common';

const LOCAL_STORAGE_CONSENT_KEY = 'hasAnalyticsConsent';

enum AnalyticsConsentDecision {
    granted = 'granted',
    denied = 'denied',
}

/**
 * GTM head insert
 *
 * @returns - jsx
 */
export const GTMHead = gtmId ? () => {
    useEffect(() => {
        const gtmScript = document.createElement('script')

        if (nonce) {
            gtmScript.setAttribute('nonce', nonce)
        }

        gtmScript.innerHTML = `
                // Define dataLayer and the gtag function.
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}

                // Default analytics_storage to 'denied'.
                window.gtag = window.gtag || gtag;

                const hasAnalyticsConsent = window?.localStorage.getItem('${ LOCAL_STORAGE_CONSENT_KEY }');

                window.gtag('consent', 'default', {
                    'analytics_storage': hasAnalyticsConsent === 'true' ? '${ AnalyticsConsentDecision.granted }' : '${ AnalyticsConsentDecision.denied }',
                    'wait_for_update': hasAnalyticsConsent === 'true' ? 0 : Infinity,
                });

                dataLayer.push({
                    'event': 'default_consent'
                });

                function loadGtm(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;var n=d.querySelector('[nonce]');
                n&&j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'));f.parentNode.insertBefore(j,f);
                }

                loadGtm(window, document, 'script', 'dataLayer', '${ gtmId }')
            `

        document.head.appendChild(gtmScript)

        return () => {
            document.head.removeChild(gtmScript)
        }
    }, [])

    return null;
} : () => null;
