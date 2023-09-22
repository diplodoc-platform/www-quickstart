import React from 'react';
import { useModel } from '@modelsjs/react';
import { Prefetch as PrefetchModel } from '~/models/prefetch';
import { Transferable } from '../Transferable';

export const Prefetch = () => {
    const prefetch = useModel(PrefetchModel);

    return (
        <div id="prefetch">
            {
                Object.keys(prefetch.items).map((key) => {
                    return (<Transferable key={ key } id={ key } data={ prefetch.items[key] }/>);
                })
            }
        </div>
    );
};