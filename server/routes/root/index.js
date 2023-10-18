import {Router} from 'express';
import cabinet from '@diplodoc/cabinet';
import manifest from '@diplodoc/cabinet/manifest';

import config from '../../utils/config.js';

export const router = ({navigation, urls, base, customFetch = null}) => {
    const router = new Router();

    router.get('/', async (req, res) => {
        const bootstrap = manifest(base || '/static');

        const state = {
            ...config(req, customFetch),
            manifest: bootstrap,
            urls,
            navigation
        };

        const {pipe} = cabinet(state).render({
            url: req.url
        }, {
            bootstrapScripts: bootstrap.scripts,
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
