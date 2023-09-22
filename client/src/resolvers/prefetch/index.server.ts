import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { construct, once, ModelState } from '@modelsjs/model';
import { Prefetch as PrefetchModel } from '~/models/prefetch';
import { PrefetchStrategy } from '../strategy';
import { sign, stringify } from '~/utils';

export const Prefetch: TResolver = {
    get strategy() {
        return PrefetchStrategy;
    },

    sync(models: Model[]) {
        const prefetch = construct(PrefetchModel);

        models.forEach((model) => {
            once(model, 'state', (state) => {
                if (state === ModelState.Ready) {
                    prefetch.add(sign(model), stringify(model));
                }
            });
        });

        return [ [], models ];
    },
};