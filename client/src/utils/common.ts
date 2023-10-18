export enum Env {
    Dev = 'dev',
    Preprod = 'preprod',
    Prod = 'prod',
}

export function getEnv() {
    return (process.env.APP_ENV as Env) || (process.env.DEV_MODE || false ? Env.Preprod : Env.Prod);
}

