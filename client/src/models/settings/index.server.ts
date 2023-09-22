import {resolvable} from '@modelsjs/resolver';
import {Server} from '~/resolvers/strategy';
import {Settings as Base} from './settings';

@resolvable(Server)
export class Settings extends Base {
    static async action() {
        return {
            theme: 'dark',
        };
    }
}