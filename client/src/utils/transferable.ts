// @see https://stackoverflow.com/a/52647441/1177115
function b64e(string: string) {
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(Number('0x' + p1));
        }));
}

// @see https://stackoverflow.com/a/52647441/1177115
function b64d(string: string) {
    return decodeURIComponent(atob(string).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

export const parse = (string: string) => JSON.parse(b64d(string));

export const stringify = (object: object) => b64e(JSON.stringify(object));