import React, { memo } from 'react';

import { Resolver, Wait } from '@modelsjs/react';
import { Setup } from './components/Setup';
import { Head } from './components/Head';
import { ErrorBoundary, Fallback } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Analytics } from './components/Analytics';
import { Prefetch } from './components/Prefetch';

import * as env from '~/configs/env';
import { resolvers } from './resolvers';
import { configureLang } from '../i18n/configureLang';

export const App = memo(() => {
    configureLang(env.lang || 'ru');

    return (
        <html>
        <Head/>
        <body>
        <ErrorBoundary fallback={ Fallback }>
            <Resolver resolvers={ resolvers }>
                <Layout>
                    <Resolver>
                        <Setup/>
                    </Resolver>
                </Layout>
                <Analytics/>
                <Wait>
                    <Prefetch/>
                </Wait>
            </Resolver>
        </ErrorBoundary>
        </body>
        </html>
    );
});