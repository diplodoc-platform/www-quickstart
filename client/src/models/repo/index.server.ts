import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { Repo as Base } from './repo';
import { GhRepo } from '../../api/models/gh-repo';

@resolvable(Server(GhRepo))
export class Repo extends Base {}