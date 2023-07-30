import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { Prefetch as PrefetchModel } from '~/models/prefetch';
import { PrefetchStrategy } from '../strategy';
import { set, construct } from '@modelsjs/model';
import { sign } from './utils';

const parse = (string) => JSON.parse(atob(string));

export const Prefetch: TResolver = {
    get strategy() {
        return PrefetchStrategy;
    },

    sync(models: Model[]) {
        const prefetch = construct(PrefetchModel);

        models.forEach((model) => {
            const key = sign(model);

            if (!prefetch.has(key)) {
                const script: HTMLElement = document.querySelector(`#prefetch > [data-id="${key}"]`);

                if (script) {
                    prefetch.add(sign(model), script.innerText);
                } else {
                    throw new Error(`Prefetch for "${key}" not found`);
                }
            }

            set(model, parse(prefetch.get(key)));
        });

        return [ models ];
    },
};