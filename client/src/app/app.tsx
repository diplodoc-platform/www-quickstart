import React, { memo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Resolver, Wait } from '@modelsjs/react';
import { Setup } from './components/Setup';
import { Prefetch } from './components/Prefetch';
import { stringify } from '~/utils';

import * as env from '~/configs/env';
import * as manifest from '~/configs/manifest';
import * as navigation from '~/configs/navigation';
import * as urls from '~/configs/urls';
import { resolvers } from './resolvers';
import { Transferable } from './components/Transferable';
import {configureLang, i18n} from '../i18n/configureLang';


export const App = memo(() => {
    configureLang(env.lang || 'ru')
    i18n.setLang(env.lang || 'ru')

    return (
        <html>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>My app</title>
            <Transferable id="config-env" data={ stringify({ ...env, isServer: true }) }/>
            <Transferable id="config-manifest" data={ stringify(manifest) }/>
            <Transferable id="config-navigation" data={ stringify(navigation) }/>
            <Transferable id="config-urls" data={ stringify(urls) }/>
            {
                manifest.styles.map((style) => (
                    <link key={ style } rel="stylesheet" href={ style }/>
                ))
            }
        </head>
        <body>
        <ErrorBoundary fallback={ <div>'Error...'</div> }>
            <Resolver fallback={ <div></div> } resolvers={ resolvers }>
                <Setup/>
                <Wait>
                    <Prefetch/>
                </Wait>
            </Resolver>
        </ErrorBoundary>
        </body>
        </html>
    );
});