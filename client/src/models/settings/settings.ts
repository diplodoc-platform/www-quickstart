import { Model } from '@modelsjs/model';
import { resolvable } from '@modelsjs/resolver';
import { Prefetch } from '~/resolvers/strategy';

export enum Theme {
    Light = 'light',

    Dark = 'dark',
}

@resolvable(Prefetch)
export class Settings extends Model {
    static displayName = 'settings';

    theme!: Theme;
}