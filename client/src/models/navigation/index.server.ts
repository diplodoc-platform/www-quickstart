import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { Navigation as Base } from './navigation';
import { Navigation as NavigationModel } from '../../api/models/navigation';

@resolvable(Server(NavigationModel))
export class Navigation extends Base {}