import type { FC } from 'react';
import React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Resolver, Wait } from '@modelsjs/react';
import { Content } from './components/Content';
import { Prefetch } from './components/Prefetch';
import { stringify } from '~/utils';

import * as env from '~/configs/env';
import * as manifest from '~/configs/manifest';
import { Transferable } from './components/Transferable';

type AppProps = {
    resolvers: Resolver[]
};

export const App: FC<AppProps> = ({ resolvers }) => {
    return (
        <html>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>My app</title>
            <Transferable id="config-env" data={ stringify({ ...env, isServer: true }) }/>
            <Transferable id="config-manifest" data={ stringify(manifest) }/>
            {
                manifest.styles.map((style) => (
                    <link key={ style } rel="stylesheet" href={ style }/>
                ))
            }
        </head>
        <body className="g-root g-root_theme_dark">
        <ErrorBoundary fallback={<div>'Error...'</div>}>
            <Resolver fallback={ <div></div> } resolvers={ resolvers }>
                <Content/>
                <Wait>
                    <Prefetch/>
                </Wait>
            </Resolver>
        </ErrorBoundary>
        </body>
        </html>
    );
};