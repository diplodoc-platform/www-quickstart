import {URLSearchParams} from 'node:url';

export function sign(params, set) {
    const acc = new URLSearchParams();

    set = set || new Set();

    Object.keys(params)
        .sort()
        .forEach((key) => {
            const value = params[key];

            if (value && typeof value === 'object') {
                if (set.has(value)) {
                    // skip circular
                    return;
                }

                set.add(value);
                acc.append(key, sign(value, set));
            } else {
                acc.append(key, params[key]);
            }
        });

    return acc.toString();
}

function extractField(acc, field, value, object, prefix) {
    if (value === true) {
        acc[prefix + field] = object[field];
    }

    if (typeof value === 'string') {
        acc[prefix + field] = object[value];
    }

    if (typeof value === 'function') {
        acc[prefix + field] = value(object);
    }

    return acc;
}

export function extractFields(object, request, prefix = '') {
    prefix = prefix ? prefix + '.' : prefix;

    if (request === '*') {
        return Object.keys(object).reduce(
            (acc, key) => extractField(acc, key, true, object, prefix),
            {},
        );
    } else if (Array.isArray(request)) {
        return request.reduce((acc, prop) => extractField(acc, prop, prop, object, prefix), {});
    } else if (typeof request === 'object') {
        return Object.keys(request).reduce(
            (acc, key) => extractField(acc, key, request[key], object, prefix),
            {},
        );
    }

    return {};
}
