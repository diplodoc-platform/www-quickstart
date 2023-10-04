import express, {Router} from 'express';
import session from 'cookie-session';
import {NodeKit} from '@gravity-ui/nodekit';
import {withModels} from './models-runtime/index.js';

import {router as root} from "./routes/root/index.js";
import {router as api} from "./routes/api/index.js";
import {router as login} from "./routes/login/index.js";

export const router = new Router();

const {COOKIE_SECRET} = process.env;

const nodekit = new NodeKit({
    disableDotEnv: true,
    config: {
        appTracingEnabled: false,
    }
});

router.use(express.json());

router.use(session({
    name: 'session',
    keys: [COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}));

router.use((req, res, next) => {
    req.ctx = res.ctx = nodekit.ctx.create(req.url);
    withModels(req, res);
    next();
});

router.get('/', root);
router.use('/api', api);
router.use('/login', login);
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session = null;
    }

    res.redirect('/');
});

