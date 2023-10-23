import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { Project as Base } from './project';
import { Project as ServerProject } from '../../api/models/project';

@resolvable(Server(ServerProject))
export class Project extends Base {}