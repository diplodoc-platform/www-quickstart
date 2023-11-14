import React, { memo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Resolver, Wait } from '@modelsjs/react';
import { Setup } from './components/Setup';
import { Prefetch } from './components/Prefetch';

import * as env from '~/configs/env';
import { resolvers } from './resolvers';
import { configureLang, i18n } from '../i18n/configureLang';
import {Head} from "./components/Head";

function fallbackRender({ error }) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.message}</pre>
        </div>
    );
}

export const App = memo(({nonce}) => {
    configureLang(env.lang || 'ru')
    i18n.setLang(env.lang || 'ru')

    return (
        <html>
        <Head nonce={nonce}/>
        <body>
        <ErrorBoundary fallbackRender={fallbackRender}>
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