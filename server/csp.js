import { expressCspHeader, NONE, SELF, NONCE, INLINE } from 'express-csp-header';

const YANDEX_STORAGE = 'storage.yandexcloud.net';
const GITHUB_AVATARS = 'avatars.githubusercontent.com';

export default expressCspHeader({
    directives: {
        'default-src': [NONE],
        'script-src': [SELF, NONCE],
        'style-src': [SELF, INLINE],
        'img-src': ['data:', SELF, YANDEX_STORAGE, GITHUB_AVATARS],
        'connect-src': [SELF]
    }
})
