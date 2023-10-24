import { createHmac, timingSafeEqual } from 'crypto';

const VERSION = '1';
const DAY_MS = 24 * 60 * 60 * 1000;
const ALG = 'sha1';

function calculateHmac(deadline, uid, secret) {
    return createHmac(ALG, secret)
        .update(`${uid}:${deadline}`)
        .digest();
}

export function generate(uid, secret) {
    const deadline = Date.now() + DAY_MS;
    const hmac = calculateHmac(deadline, uid, secret).toString('base64');

    return `${VERSION}!${deadline.toString(36)}!${hmac}`;
}

export function validate(uid, secrets, value) {
    if (!value) {
        throw 'CSRF_NODATA';
    }

    const parts = value.split('!');

    const version = parts[0];
    if (version !== VERSION) {
        throw 'CSRF_INVALID_VERSION';
    }

    const deadline = parseInt(parts[1] || '0', 36);
    if (deadline < Date.now()) {
        throw 'CSRF_OUTDATED';
    }

    const hmac = Buffer.from(parts[2], 'base64')
    const isValid = secrets.some(
        (secret) => timingSafeEqual(calculateHmac(deadline, uid, secret), hmac)
    );

    if (!isValid) {
        throw 'CSRF_INVALID_HMAC';
    }
}