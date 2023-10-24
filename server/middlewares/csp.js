import { expressCspHeader, NONE, SELF, NONCE, INLINE } from 'express-csp-header';

const YANDEX_STORAGE = 'storage.yandexcloud.net';
const GITHUB_AVATARS = 'avatars.githubusercontent.com';

export function csp(staticBase) {
    const DEV = staticBase.startsWith('http') ? [staticBase] : [];

    return expressCspHeader({
        directives: {
            'default-src': [NONE],
            'script-src': [SELF, NONCE].concat(DEV),
            'style-src': [SELF, INLINE].concat(DEV),
            'img-src': ['data:', SELF, YANDEX_STORAGE, GITHUB_AVATARS],
            'connect-src': [SELF]
        }
    });
}