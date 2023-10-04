import Models from '@diplodoc/cabinet/models';
import config from '../../../utils/config.js';

export const handle = async (req, res) => {
    const models = req.body.models;
    const result = {};
    const MODELS = Models(config(req)).default;

    await Promise.all(Object.keys(models).map(async (key) => {
        const [alias] = key.split('?');

        result[key] = {};

        if (MODELS[alias]) {
            try {
                result[key].data = await req.ctx.request(MODELS[alias], models[key]);
            } catch (error) {
                result[key].error = {
                    message: error.message,
                    code: error.code || 'UNKNOWN'
                };
            }
        } else {
            result[key].error = {
                message: 'Unknown model alias ' + alias,
                code: 'UNKNOWN'
            };
        }
    }));

    res.send({
        status: 'OK',
        models: result
    });
}