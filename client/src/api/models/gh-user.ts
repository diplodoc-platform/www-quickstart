import { Octokit } from './services/octokit';
import { AuthError } from '../errors';

import { accessToken } from '~/configs/server';

export async function GhUser() {
    const octokit = Octokit();

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
        throw new AuthError(error?.message);
    }
}

GhUser.displayName = 'user';
