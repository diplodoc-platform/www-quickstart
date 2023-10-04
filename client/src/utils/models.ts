import type { Model } from '@modelsjs/model';
import { getSign } from '@modelsjs/model';

export const sign = (alias: string, model: Model) => {
    if (!alias) {
        throw new TypeError('Model without alias cannot be prefetched');
    }

    const sign = getSign(model);

    return alias + (sign ? '?' + sign : '');
};