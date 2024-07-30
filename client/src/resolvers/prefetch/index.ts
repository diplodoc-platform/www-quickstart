import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { Prefetch as PrefetchModel } from '~/models/prefetch';
import { IPrefetchStrategyImpl, PrefetchStrategy } from '../strategy';
import { set, construct, ModelError } from '@modelsjs/model';
import { sign, parse } from '~/utils';

export const Prefetch: TResolver = {
    get strategy() {
        return PrefetchStrategy;
    },

    sync(models: (Model & IPrefetchStrategyImpl)[]) {
        const prefetch = construct(PrefetchModel, {});

        models.forEach((model) => {
            const {alias} = model[PrefetchStrategy];
            const key = sign(alias, model);

            if (!prefetch.has(key)) {
                const script = document.querySelector<HTMLElement>(`script[data-transfer-id="${key}"]`);

                if (script) {
                    prefetch.add(key, script.innerText);
                }
            }

            const value = prefetch.get(key)

            if (value) {
                const {data, error} = parse(value);
                set(model, error ? new ModelError(model, error) : data);
            }
        });
    },
};