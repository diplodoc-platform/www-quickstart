import {resolvable} from '@modelsjs/resolver';
import {Server} from '~/resolvers/strategy';
import {User as Base} from './user';

import {accessToken} from '~/configs/session';

@resolvable(Server)
export class User extends Base {
    static async action() {
        if (!accessToken) {
            return {};
        }

        const request = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: 'token ' + accessToken,
            },
        });

        return request.json();
    }
}