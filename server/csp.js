const STORAGE_YANDEXCLOUD = 'https://storage.yandexcloud.net'
const GITHUB_AVATARS = 'https://avatars.githubusercontent.com'

const policiesConfig = (nonce) => ({
    'default-src': ["'self'"],
    'script-src': ["'self'", `'nonce-${nonce}'`],
    'script-src-elem': [
        "'self'",
        `'nonce-${nonce}'`,
        "'sha256-QJMV+8o55Siq3qmeIm553wsoTvqwgbwBpF1WGV248KA='",
        "'sha256-huOR9NBDfdSCaHx+9lxUoMZdVcP1iJAY4Xi6oWfXeWI='",
        "'sha256-KEMK7IhB2yIkoHwmeeMOoS4BvSbD3abOSYMLQCQ2Hmk='",
        "'sha256-pD1IvxrgXgKrAhNJmdMwtplCR1BZCy9ekf7LyKljrWI='"
    ],
    'style-src': ["'self'", `nonce-${nonce}`],
    'object-src': ["'self'"],
    'style-src-elem': ["'self'"],
    'style-src-attr': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", STORAGE_YANDEXCLOUD, GITHUB_AVATARS],
    'font-src': ["'self'"],
    'child-src': ["'self'"],
    'frame-src': ["'self'"],
    'frame-ancestors': ["'self'"],
    'connect-src': ["'self'"],
});

const getCSP = (config) =>
    Object.entries(config)
        .map(([name, values]) => {
            const policies = values.map((v) => (Array.isArray(v) ? v.join(' ') : v)).join(' ');

            return `${name} ${policies};`;
        })
        .join(' ');

export default (nonce) => getCSP(policiesConfig(nonce));
