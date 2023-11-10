import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { hydrateRoot } from 'react-dom/client';
import { App } from './app';

import './index.css';

export function render(test) {
    try {
        hydrateRoot(document, (
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        ));
    } catch (error) {
        console.error(error);
    }
}

render();