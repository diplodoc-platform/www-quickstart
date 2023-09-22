import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { Prefetch as PrefetchModel } from '~/models/prefetch';
import { PrefetchStrategy } from '../strategy';
import { set, construct } from '@modelsjs/model';
import { sign, parse } from '~/utils';
import { split, isResolved } from '@modelsjs/resolver';

export const Prefetch: TResolver = {
    get strategy() {
        return PrefetchStrategy;
    },

    sync(models: Model[]) {
        const prefetch = construct(PrefetchModel, {});

        models.forEach((model) => {
            const key = sign(model);

            if (!prefetch.has(key)) {
                const script: HTMLElement = document.querySelector(`script[data-transfer-id="${key}"]`);

                if (script) {
                    prefetch.add(sign(model), script.innerText);
                }
            }

            const value = prefetch.get(key)

            if (value) {
                set(model, parse(value));
            }
        });

        return split(models, isResolved);
    },
};