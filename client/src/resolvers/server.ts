import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { set, getProps, ModelError } from '@modelsjs/model';
import { IServerStrategyImpl, ServerStrategy } from './strategy';

export const Server: TResolver = {
    get strategy() {
        return ServerStrategy;
    },

    async async(models: (Model & IServerStrategyImpl)[]) {
        const api = __webpack_require__.__STATE__.api;

        await Promise.all(models.map(async (model) => {
            try {
                const { action } = model[ServerStrategy];
                const result = await api.request(action, getProps(model));
                set(model, result);
            } catch (error) {
                set(model, new ModelError(model, error));
            }
        }))

        return [ models ];
    },
};