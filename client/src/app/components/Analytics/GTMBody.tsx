import React from 'react';
import { gtmId } from '~/configs/common';

/**
 * GTM body insert
 *
 * @param id - tag id
 *
 * @returns - jsx
 */

export const GTMBody = gtmId ? () => (
    <noscript
        dangerouslySetInnerHTML={ {
            __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${ gtmId }"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
        } }
    />
) : () => null;
