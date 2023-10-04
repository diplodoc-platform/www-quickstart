import { Model } from '@modelsjs/model';
import { resolvable } from '@modelsjs/resolver';
import { Prefetch } from '~/resolvers/strategy';

@resolvable(Prefetch('repo'))
export class Repo extends Model<{ owner?: string, repo: string }> {
    id!: string;

    name!: string;

    fullname!: string;

    owner!: {
        id: number;
        name: string;
    };

    link!: string;
}