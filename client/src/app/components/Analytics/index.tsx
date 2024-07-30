import React from 'react';
import { useModel } from '@modelsjs/react';

import { Navigation } from '~/models/navigation';
import { useAnalytics } from './useAnalytics';
import { ConsentPopup } from './ConsentPopup';
import { GTMBody } from './GTMBody';
import { GTMHead } from './GTMHead';
import * as common from '~/configs/common';
import * as env from '~/configs/env';

export { GTMBody, GTMHead };

export const Analytics = () => {
    const [ navigation ] = useModel(Navigation, { lang: env.lang }, true);

    const { consentValue, hasConsent, updateConsent, analyticsRef } = useAnalytics({},
        common.gtmId || '',
    );

    if (!navigation?.analytics || !common.gtmId) {
        return null;
    }

    return (
        <>
            <GTMBody/>
            { consentValue !== undefined && !hasConsent && (
                <ConsentPopup
                    { ...navigation.analytics.popup }
                    onAction={ updateConsent }
                    containerRef={ analyticsRef }
                />
            ) }
        </>
    );
};