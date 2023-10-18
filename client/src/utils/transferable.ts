export const parse = (string) => JSON.parse(decodeURIComponent(escape(atob(string))));

export const stringify = (object) => btoa(unescape(encodeURIComponent(JSON.stringify(object))));