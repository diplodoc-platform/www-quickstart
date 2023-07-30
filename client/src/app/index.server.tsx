import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { renderToPipeableStream } from 'react-dom/server';

import { App } from './app';
import { Server, Static, Prefetch } from '~/resolvers';

type Props = {
    url?: string;
};

export function render(props: Props, stream) {
    const resolvers = [
        Prefetch,
        Static,
        Server,
    ];

    return renderToPipeableStream((
        <StaticRouter location={ props.url }>
            <App { ...{ resolvers } } />
        </StaticRouter>
    ), stream);
}