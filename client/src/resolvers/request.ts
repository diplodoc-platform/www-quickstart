import type { Model } from '@modelsjs/model';
import type { TResolver } from '@modelsjs/resolver';
import { set, getProps, ModelError } from '@modelsjs/model';
import { RequestStrategy, IRequestStrategyImpl } from './strategy';
import * as user from '~/configs/user';
import { api, base } from '~/configs/urls';
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
                requests[key].promise = requests[key].promise.then(
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

            return requests[key].promise;
        }));

        return [ models ];
    },
};

async function request(models: Record<string, OJSON>) {
    if (!Object.keys(models).length) {
        return;
    }

    let response;
    try {
        const request = await fetch(base + api + '/models', {
            method: 'post',
            body: JSON.stringify({models}),
            headers: {
                'content-type': 'application/json',
                'x-user-id': user.id,
                'x-csrf-token': user.sign,
            },
        });

        if (!request.ok) {
            try {
                response = await request.json();
            } catch (error) {
                response = {
                    error: {
                        message: request.statusText,
                        code: 'UNHANDLED_REQUEST_ERROR',
                    },
                };;
            }
        } else {
            response = await request.json();
        }
    } catch (error) {
        response = {
            error: {
                message: error.message,
                code: 'UNHANDLED_REQUEST_ERROR',
            },
        };
    }

    // TODO: handle csrf renew

    Object.keys(models).forEach((key) => {
        const result = getResult(response, key);
        const defer = requests[key];

        if (defer) {
            delete requests[key];

            const {data, error} = result;

            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(data);
            }
        }
    });
}

function getResult(response: OJSON, key: string) {
    if (!response.models) {
        return {
            error: response.error
        }
    }

    if (!response.models[key]) {
        return {
            error: {
                code: 'NODATA',
                message: 'No Data'
            }
        };
    }

    return response.models[key];
}