import { Octokit } from 'octokit';
import { AuthError } from '../errors';

import { accessToken } from '~/configs/server';

export async function GhUser() {
    const octokit = new Octokit({ auth: accessToken });

    try {
        const { data } = await octokit.request('GET /user');

        return {
            id: data.id,
            name: data.name,
            login: data.login,
            link: data.html_url,
            avatar: data.avatar_url,
        };
    } catch (error) {
        throw new AuthError();
    }
}

GhUser.displayName = 'user';