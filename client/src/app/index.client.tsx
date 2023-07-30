import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { hydrateRoot } from 'react-dom/client';

import { App } from './app';
import { Prefetch, Static } from '~/resolvers/index';

export function render() {
    try {
        const resolvers = [
            Prefetch,
            Static
        ];

        hydrateRoot(document, (
            <BrowserRouter>
                <App { ...{ resolvers } } />
            </BrowserRouter>
        ));
    } catch (error) {
        console.error(error);
    }
}

render();