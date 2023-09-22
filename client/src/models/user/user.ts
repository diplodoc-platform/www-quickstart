import {Model} from '@modelsjs/model';
import {resolvable} from '@modelsjs/resolver';
import {Prefetch} from '~/resolvers/strategy';

@resolvable(Prefetch)
export class User extends Model {
    static displayName = 'user';

    id!: string;

    name!: string;

    login!: string;

    link!: string;

    avatar!: string;
}