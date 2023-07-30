import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { set, getProps } from '@modelsjs/model';
import { ServerStrategy } from './strategy';

export const Server: TResolver = {
    get strategy() {
        return ServerStrategy;
    },

    async async(models: Model[]) {
        const api = __webpack_require__.__STATE__.api;

        await Promise.all(models.map(async (model) => {
            try {
                set(model, await api.request(model.constructor, getProps(model)));
            } catch (error) {
                set(model, error);
            }
        }))

        return [ models ];
    },
};