export const parse = (string: string) => JSON.parse(atob(string));

export const stringify = (object: object) => btoa(JSON.stringify(object));