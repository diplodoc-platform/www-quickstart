import {Router} from 'express';
import cabinet from '@diplodoc/cabinet';
import manifest from '@diplodoc/cabinet/manifest';

import config from '../../utils/config.js';
import navigation from './navigation.js';

export const router = new Router();

router.get('/', async (req, res) => {
    const bootstrap = manifest('/static');

    const state = {
        ...config(req),
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

