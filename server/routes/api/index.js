import {Router} from 'express';
import {handle as models} from './models/index.js';
import {handle as actions} from './actions/index.js';

export const router = new Router();

const call = (handle) => async (req, res, next) => {
    try {
        await handle(req, res);
    } catch (error) {
        next(error);
    }
}

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