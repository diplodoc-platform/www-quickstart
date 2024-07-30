import {env} from 'node:process';
import {expressCspHeader, NONE, SELF, NONCE, INLINE} from 'express-csp-header';

const YANDEX_STORAGE = 'storage.yandexcloud.net';
const GITHUB_AVATARS = 'avatars.githubusercontent.com';
const GTM = 'https://www.googletagmanager.com';
const GTM_FONTS = 'https://fonts.googleapis.com';
const GTM_FONTS_STATIC = 'https://fonts.gstatic.com';
const YANDEX_METRIKA = 'https://mc.yandex.ru/';

export function csp(staticBase) {
    const DEV = staticBase.startsWith('http') ? [staticBase] : [];
    const WS = env.HMR_ENDPOINT ? [env.HMR_ENDPOINT] : [];
    return expressCspHeader({
        directives: {
            'default-src': [NONE],
            'script-src': ["'unsafe-inline'", SELF, GTM, YANDEX_METRIKA, GTM_FONTS].concat(DEV),
            'style-src': [SELF, INLINE].concat(DEV),
            'img-src': ['data:', SELF, YANDEX_STORAGE, GITHUB_AVATARS],
            'connect-src': [SELF, YANDEX_METRIKA].concat(WS),
            'font-src': ["'self'", GTM_FONTS_STATIC],
        }
    });
}