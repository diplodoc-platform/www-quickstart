import { resolvable } from '@modelsjs/resolver';
import { Server } from '~/resolvers/strategy';
import { User as Base } from './user';

import { accessToken } from '~/configs/server';
import { Octokit } from 'octokit';

@resolvable(Server)
export class User extends Base {
    static async action() {
        if (!accessToken) {
            return {};
        }

        const ukit = new Octokit({
            auth: accessToken
        });

        const { data } = await ukit.request('GET /user/installations', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return {
            id: data.id,
            name: data.name,
            login: data.login,
            link: data.html_url,
            avatar: data.avatar_url,
        };
    }
}