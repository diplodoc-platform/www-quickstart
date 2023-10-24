import {fetchGitHubUser} from "../routes/auth/index.js";

export class AuthError extends Error {
    constructor(message) {
        super(message || 'No Auth');

        this.code = 'NOAUTH';
    }
}

export function auth(customFetch, {safe} = {}) {
    return async function (req, res, next) {
        try {
            const {accessToken} = req.session || {};

            if (!accessToken) {
                throw new AuthError('Unauthorized');
            }

            req.auth = await fetchGitHubUser(accessToken, customFetch);
        } catch (error) {
            if (!safe) {
                next(new AuthError(error?.message));
                return;
            }

            req.auth = {};
        }

        next();
    }
}