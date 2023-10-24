import {Router} from 'express';
import cabinet from '@diplodoc/cabinet';
import manifest from '@diplodoc/cabinet/manifest';

import config from '../../utils/config.js';
import {csp} from '../../middlewares/csp.js';
import {auth} from "../../middlewares/auth.js";
import {csrf} from "../../middlewares/csrf.js";
import {expectEnv} from "../../utils/envconfig.js";

const csrfSecret = expectEnv('CSRF_SECRET')();

export const router = ({navigation, urls, staticBase, customFetch = null}) => {
    const router = new Router();

    router.use(csp(staticBase));
    router.use(auth(customFetch, {safe: true}));
    router.use(csrf(JSON.parse(csrfSecret), {renew: true}));

    router.get('/', async (req, res) => {
        const bootstrap = manifest(staticBase || '/static');

        const state = {
            ...config(req, customFetch),
            manifest: bootstrap,
            urls,
            navigation,
            lang: req.lang || 'ru',
        };

        const {pipe} = cabinet(state).render({
            url: req.url
        }, {
            nonce: req.nonce,
            bootstrapScripts: bootstrap.scripts.map(el => urls.base + el),
            onShellReady() {
                res.setHeader('content-type', 'text/html');
                pipe(res);
            },
            onShellError(error) {
                console.error(error);

                res.statusCode = 500;
                res.setHeader('content-type', 'text/html');
                res.send('<h1>Something went wrong</h1>');
            },
            onError(error) {
                console.error(error);
            },
        });
    });

    return router;
}
