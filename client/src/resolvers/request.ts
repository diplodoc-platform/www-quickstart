import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { set, getProps, ModelError } from '@modelsjs/model';
import { RequestStrategy, IRequestStrategyImpl } from './strategy';
import { api } from '~/configs/urls';
import { sign } from '~/utils';

const requests: Record<string, Defer> = {};

class Defer {
    promise: Promise<OJSON>;

    resolve!: (data: OJSON) => void;

    reject!: (error: any) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export const Request: TResolver = {
    get strategy() {
        return RequestStrategy;
    },

    async async(models: (Model & IRequestStrategyImpl)[]) {
        request(models.reduce((acc, model) => {
            const {alias} = model[RequestStrategy];
            const key = sign(alias, model);

            if (!requests[key]) {
                requests[key] = new Defer();
                requests[key].promise.then(
                    (result) => set(model, result),
                    (error) => set(model, new ModelError(model, error))
                );

                acc[key] = getProps(model);
            }

            return acc;
        }, {} as Record<string, OJSON>));

        await Promise.all(models.map((model) => {
            const {alias} = model[RequestStrategy];
            const key = sign(alias, model);

            return requests[key];
        }));

        return [ models ];
    },
};

async function request(models: Record<string, OJSON>) {
    if (!Object.keys(models).length) {
        return;
    }

    const request = await fetch(api + '/models', {
        method: 'post',
        body: JSON.stringify({models}),
        headers: {
            'content-type': 'application/json'
        },
    });

    const result = await request.json();

    Object.keys(result.models).forEach((key) => {
        const defer = requests[key];

        if (defer) {
            delete requests[key];

            const {data, error} = result.models[key];

            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(data);
            }
        }
    });
}