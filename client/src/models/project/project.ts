import type { Result as ServerProject } from '../../api/models/project';
import { Model } from '@modelsjs/model';
import { resolvable } from '@modelsjs/resolver';
import { Prefetch } from '~/resolvers/strategy';

@resolvable(Prefetch('project'))
export class Project extends Model<{ id: string, repo: string, owner: string }> implements ServerProject {
    name!: string;

    link?: string;

    deploy?: string;
}