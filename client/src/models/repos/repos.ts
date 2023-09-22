import {Model, map} from '@modelsjs/model';
import {resolvable} from '@modelsjs/resolver';
import {Prefetch} from '~/resolvers/strategy';

export class Installation extends Model {
    id!: number;
    url!: string;
}

export class Repo extends Model<{id: number}> {
    id!: number;
    name!: string;
    url!: string;
    owner!: string;
    main!: string;
    installation!: Installation;
}

export class Owner extends Model<{name: number}> {
    name!: string;
    avatar!: string;
    url!: string;
    installation!: Installation;
}

@resolvable(Prefetch)
export class Repos extends Model {
    static displayName = 'repos';

    @map('name', Owner)
    owners!: Owner[];

    @map('id', Repo)
    repos!: Repo[];

    tree!: Record<number, number[]>;
}