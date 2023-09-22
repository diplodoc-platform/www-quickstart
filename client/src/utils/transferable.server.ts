export const parse = (string) => JSON.parse(Buffer
    .from(string, 'base64')
    .toString('utf8'));

export const stringify = (object) => Buffer
    .from(JSON.stringify(object), 'utf8')
    .toString('base64');