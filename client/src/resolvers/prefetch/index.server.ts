import type { Model, ModelError } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { construct, once, ModelState, getError } from '@modelsjs/model';
import { Prefetch as PrefetchModel } from '~/models/prefetch';
import { IPrefetchStrategyImpl, PrefetchStrategy } from '../strategy';
import { sign, stringify } from '~/utils';

export const Prefetch: TResolver = {
    get strategy() {
        return PrefetchStrategy;
    },

    sync(models: (Model & IPrefetchStrategyImpl)[]) {
        const prefetch = construct(PrefetchModel);

        models.forEach((model) => {
            const { alias } = model[PrefetchStrategy];
            const key = sign(alias, model);

            once(model, 'state', (state) => {
                if (state === ModelState.Ready) {
                    prefetch.add(key, stringify({ data: model }));
                } else if (state === ModelState.Error) {
                    const error = getError(model) as ModelError;

                    prefetch.add(key, stringify({
                        error: {
                            code: error.code || 'UNKNOWN',
                            message: error.message
                        }
                    }));
                }
            });
        });

        return [ [], models ];
    },
};