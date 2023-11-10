export interface GTMEventParams {
    action: string;
}

//queue for events that have been fired before analytics was initialized
const queue: GTMEventParams[] = [];

const sendEvent = ({action}: GTMEventParams) => {
    window.gtag?.('event', action);
};

declare global {
    interface Window {
        dataLayer: Record<string, never>[];
    }
}

/**
 * Func for sent gtm events
 *
 * @param params - event params
 * @returns - void
 */
export const gtmEvent = (params: GTMEventParams) => {
    const gtmDataLayer = window?.dataLayer || [];

    const isConsentGranted = gtmDataLayer.some(
        (layer) => layer[0] === 'consent' && layer[2]['analytics_storage'] === 'granted',
    );

    const isConsentDeniedUpdate = gtmDataLayer.some(
        (layer) =>
            layer[0] === 'consent' &&
            layer[1] === 'update' &&
            layer[2]['analytics_storage'] === 'denied',
    );

    const defaultAnalyticsConsent = localStorage.getItem('hasAnalyticsConsent');

    if (defaultAnalyticsConsent === 'false' || isConsentDeniedUpdate) {
        return;
    }

    // save events in queue till gtm wont be loaded
    if (!isConsentGranted) {
        queue.push(params);

        return;
    } else if (queue.length) {
        while (queue.length) {
            const deferredEvent = queue.pop();

            if (deferredEvent) {
                sendEvent(deferredEvent);
            }
        }
    }

    sendEvent(params);
};