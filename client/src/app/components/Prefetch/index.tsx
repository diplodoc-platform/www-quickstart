import React from 'react';
import {useModel} from '@modelsjs/react';
import {Prefetch as PrefetchModel} from '~/models/prefetch';

export const Prefetch = () => {
    const prefetch = useModel(PrefetchModel);

    return (
        <div id="prefetch">
            {
                Object.keys(prefetch.items).map((key) => {
                    const model = prefetch.items[key];

                    return (
                        <script key={key} data-id={key} type="application/json">
                            {model}
                        </script>
                    );
                })
            }
        </div>
    );
};