import { AuthError } from '../errors';
import { Octokit } from '../models/services/octokit';

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
        throw new AuthError();
    }
}

GhUser.displayName = 'user';