import { resolvable } from '@modelsjs/resolver';
import { Request } from '~/resolvers/strategy';
import { Repo as Base } from './repo';

@resolvable(Request('repo'))
export class Repo extends Base {}

