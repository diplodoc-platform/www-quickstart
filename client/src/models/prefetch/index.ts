import {Model, set} from '@modelsjs/model';
import {resolvable} from '@modelsjs/resolver';
import {Static} from '~/resolvers/strategy';

@resolvable(Static({
    items: {}
}))
export class Prefetch extends Model {

    items!: Record<string, string>;

    add(key: string, model: string) {
        if (this.items?.[key]) {
            return;
        }

        set(this, {
            items: {
                ...(this.items || {}),
                [key]: model
            }
        });
    }

    has(key: string) {
        return Boolean(this.items?.[key]);
    }

    get(key: string) {
        return this.items?.[key];
    }
}