import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { User as Base } from './user';
import { GhUser } from '../../api/models/gh-user';

@resolvable(Server(GhUser))
export class User extends Base {}