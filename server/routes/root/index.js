import {Router} from 'express';
import cabinet from '@diplodoc/cabinet';
import manifest from '@diplodoc/cabinet/manifest';

import config from '../../utils/config.js';

export const router = ({navigation, urls, base}) => {
    const router = new Router();

    router.get('/', async (req, res) => {
        const bootstrap = manifest(base || '/static');

        const state = {
            ...config(req),
            urls,
            manifest: bootstrap,
            navigation
        };

        const {pipe} = cabinet(state).render({
            url: req.url
        }, {
            bootstrapScripts: bootstrap.scripts,
            onShellReady() {
                res.setHeader('content-type', 'text/html');
                pipe(res);
            }
        });
    });

    return router;
}