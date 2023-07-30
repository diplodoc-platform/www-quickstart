import type { Model } from '@modelsjs/model';
import { getSign } from '@modelsjs/model';

export const sign = (model: Model) => {
    const displayName = model.constructor.displayName;

    if (!displayName) {
        throw new TypeError('Model without displayName static prop cannot be prefetched');
    }

    const sign = getSign(model);

    return displayName + (sign ? '?' + sign : '');
};