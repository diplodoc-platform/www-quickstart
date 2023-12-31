import express, {Router} from 'express';
import session from 'cookie-session';
import {NodeKit} from '@gravity-ui/nodekit';
import {withModels} from './models-runtime/index.js';
import {expectEnv} from "./utils/envconfig.js";

import {router as root} from "./routes/root/index.js";
import {router as api} from "./routes/api/index.js";
import {router as auth} from "./routes/auth/index.js";

const COOKIE_SECRET = expectEnv('COOKIE_SECRET')();

const nodekit = new NodeKit({
    disableDotEnv: true,
    config: {
        appTracingEnabled: false,
    }
});

const DEFAULT_URLS = { api: '/api', auth: '/auth' };

export const router = ({navigation, urls = {}, base = '/', staticBase = '/static', customFetch = fetch} = {}) => {
    urls = {...DEFAULT_URLS, ...urls, base};

    const router = new Router();

    router.use(express.json());

    router.use(session({
        name: 'session',
        keys: [COOKIE_SECRET],
        maxAge: 24 * 60 * 60 * 1000
    }));

    router.use((req, res, next) => {
        req.base = base;
        req.fetch = customFetch;
        req.ctx = res.ctx = nodekit.ctx.create(req.url);
        withModels(req, res);
        next();
    });

    router.get('/', root({urls, navigation, staticBase}));
    router.use(urls.api, api());
    router.use(urls.auth, auth());

    return router;
};
