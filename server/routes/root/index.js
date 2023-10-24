import {Router} from 'express';
import cabinet from '@diplodoc/cabinet';
import manifest from '@diplodoc/cabinet/manifest';

import { expressCspHeader, NONE, SELF, NONCE, INLINE } from 'express-csp-header';

import config from '../../utils/config.js';

export const router = ({navigation, urls, staticBase, customFetch = null}) => {
    const router = new Router();

    router.use(expressCspHeader({
        directives: {
            'default-src': [NONE],
            'script-src': [SELF, NONCE],
            'style-src': [SELF, INLINE],
            'img-src': ['data:', SELF, 'storage.yandexcloud.net']
        }
    }));

    router.get('/', async (req, res) => {
        const bootstrap = manifest(staticBase || '/static');

        const state = {
            ...config(req, customFetch),
            manifest: bootstrap,
            urls,
            navigation
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
