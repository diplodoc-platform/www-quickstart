export const parse = (string) => JSON.parse(atob(string));

export const stringify = (object) => btoa(JSON.stringify(object));