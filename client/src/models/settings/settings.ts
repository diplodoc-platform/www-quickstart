import { Model } from '@modelsjs/model';
import { resolvable } from '@modelsjs/resolver';
import { Prefetch } from '~/resolvers/strategy';

export enum Theme {
    Light = 'light',

    Dark = 'dark',
}

@resolvable(Prefetch('settings'))
export class Settings extends Model {
    theme!: Theme;
}