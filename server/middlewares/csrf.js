import {generate, validate} from "../utils/csrf.js";

export function csrf(secrets, {header, renew} = {}) {
    return function (req, res, next) {
        const {id} = req.auth || {};

        if (renew && id) {
            req.csrf = generate(id, secrets.slice(-1)[0]);
        } else if (header) {
            validate(id, secrets, req.headers[header]);
        }

        next();
    }
}