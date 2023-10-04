import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { Project as Base } from './project';
import { DdProject } from '../../api/models/dd-project';

@resolvable(Server(DdProject))
export class Project extends Base {}