import assert from 'node:assert';

export function expectEnv(key) {
    return (...args) => {
        try {
            assert(process.env[key], 'Missing required env variable ' + key);
        } catch (error) {
            if (args.length > 0) {
                const defaults = args[0];
                const value = typeof defaults === 'function' ? defaults() : defaults;

                // Bad idea to log ENV variables.
                // Do not uncomment this line in prod
                // console.warn(`Env variable ${key} is not configured. Use default value "${value}"`);

                return value;
            }

            throw error;
        }

        try {
            return JSON.parse(process.env[key]);
        } catch {
            return process.env[key];
        }
    };
}

const env = expectEnv('APP_ENV')('production');

export default function envConfig(config) {
    return Object.assign(config.common, config[env]);
};

envConfig.expectEnv = expectEnv;
