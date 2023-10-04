import { resolvable } from '@modelsjs/resolver';
import { Request } from '~/resolvers/strategy';
import { Project as Base } from './project';

@resolvable(Request('project'))
export class Project extends Base {}

