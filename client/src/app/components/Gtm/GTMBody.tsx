import React from 'react';
import {AnalyticsData} from "../../../types";

type GTMBodyPropsType = {
    id: AnalyticsData['id'];
};

/**
 * GTM body insert
 *
 * @param id - tag id
 *
 * @returns - jsx
 */

export const GTMBody = ({id}: GTMBodyPropsType) =>
    id ? (
        <noscript
            dangerouslySetInnerHTML={{
                __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
            }}
        />
    ) : null;
