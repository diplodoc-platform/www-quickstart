import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { set, getState, ModelState } from '@modelsjs/model';
import { StaticStrategy } from './strategy';

export const Static: TResolver = {
    get strategy() {
        return StaticStrategy;
    },

    sync(models: Model[]) {
        models.forEach((model) => {
            const { data } = model[StaticStrategy];

            if (getState(model) !== ModelState.Ready) {
                set(model, data);
            }
        });

        return [ models ];
    },
}