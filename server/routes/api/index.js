import {Router} from 'express';
import {handle as models} from './models/index.js';
import {handle as actions} from './actions/index.js';
import {auth} from '../../middlewares/auth.js';
import {csrf} from '../../middlewares/csrf.js';
import {expectEnv} from "../../utils/envconfig.js";

const csrfSecret = expectEnv('CSRF_SECRET')();

const call = (handle) => async (req, res, next) => {
    try {
        await handle(req, res);
        next();
    } catch (error) {
        next(error);
    }
};

export const router = () => {
    const router = new Router();

    router.use(auth());
    router.use(csrf(csrfSecret.keys, {header: 'x-csrf-token'}));
    router.post('/models', call(models));
    router.post('/actions/:action', call(actions));

    router.use((error, req, res, _next) => {
        res.status(500);
        res.send({
            error: {
                message: error.message || error,
                code: error.code || undefined,
            }
        });
    });

    return router;
};
