import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { renderToPipeableStream } from 'react-dom/server';

import { App } from './app';

type Props = {
    url: string;
};

export function render(props: Props, options?: RenderToPipeableStreamOptions) {
    return renderToPipeableStream((
        <StaticRouter location={ props.url }>
            <App/>
        </StaticRouter>
    ), options);
}