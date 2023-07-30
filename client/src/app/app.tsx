import type { FC, ComponentType } from 'react';
import React, { useEffect } from 'react';

import { Resolver, Wait } from '@modelsjs/react';
import { Header } from './components/Header';
import { Prefetch } from './components/Prefetch';

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
        </head>
        <body>
        <Resolver fallback={ 'Loading...' } resolvers={ resolvers }>
            <Header/>
            <Wait>
                <Prefetch />
            </Wait>
        </Resolver>
        {/*<button>*/ }
        {/*    <a href="/login/github">Authorize</a>*/ }
        {/*</button>*/ }
        {/*<button>*/ }
        {/*    <a href="https://github.com/apps/modelsjs/installations/new">Install</a>*/ }
        {/*</button>*/ }
        </body>
        </html>
    );
};