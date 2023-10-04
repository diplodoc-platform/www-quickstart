import {Model} from '@modelsjs/model';
import {resolvable} from '@modelsjs/resolver';
import {Prefetch} from '~/resolvers/strategy';

@resolvable(Prefetch('user'))
export class User extends Model {
    id!: string;

    name!: string;

    login!: string;

    link!: string;

    avatar!: string;
}