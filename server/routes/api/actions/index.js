import Actions from '@diplodoc/cabinet/actions';
import config from "../../../utils/config.js";

export const handle = async (req, res) => {
    const {action} = req.params;
    const ACTIONS = Actions(config(req)).default;
    const Action = ACTIONS[action];

    if (!Action) {
        res.status(405);
        res.send({
            status: 'ERROR',
            error: {
                code: 405,
                message: `Unknown action '${action}'`
            }
        });
    }

    res.send({
        status: 'OK',
        data: await req.ctx.request(Action, req.body)
    });
}