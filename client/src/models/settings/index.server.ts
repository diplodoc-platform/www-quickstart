import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { Settings as Base } from './settings';

const action = async () => ({
    theme: 'light',
});

action.displayName = 'settings';

@resolvable(Server(action))
export class Settings extends Base {
}