export enum Env {
    Dev = 'dev',
    Preprod = 'preprod',
    Prod = 'prod',
}

export function getEnv() {
    return (process.env.APP_ENV as Env) || (process.env.DEV_MODE || false ? Env.Preprod : Env.Prod);
}

function pause(delay = 100) {
    return new Promise(resolve => setTimeout(resolve, delay))
}

export async function retrier(operation, { attempts = Infinity, delay = 100 }) {
    let result

    for (let i = 0 ; i < attempts ; i++) {
        result = await operation()
        if (result) return result
        await pause(delay)
    }

    return result
}