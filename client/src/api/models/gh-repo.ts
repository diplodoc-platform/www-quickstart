import type { ModelContext, GHResponse, GHError } from '../../types';
import { Octokit } from './services/octokit';
import { GhUser } from './gh-user';
import { NotFoundError } from '../errors';

import { accessToken } from '~/configs/server';

type Props = {
    owner: string;
    repo: string;
};

export async function GhRepo({ owner, repo }: Props, ctx: ModelContext): Promise<ReturnType<typeof RepoResult>> {
    const octokit = Octokit();

    try {
        if (!owner) {
            const user = await ctx.request(GhUser);

            owner = user.login;
        }

        const result = await octokit.request('GET /repos/{owner}/{repo}', { owner, repo });
        const { data } = result;

        return RepoResult(data);
    } catch (error) {
        switch ((error as GHError)?.status) {
            case 404:
                throw new NotFoundError('Repository not found');
            default:
                throw error;
        }
    }
}

GhRepo.displayName = 'repo';

type RepoResultFields = 'id' | 'name' | 'full_name' | 'html_url' | 'owner' | 'permissions';

export function RepoResult(data: Pick<GHResponse<'GET /repos/{owner}/{repo}'>, RepoResultFields>) {
    return {
        id: data.id,
        name: data.name,
        fullname: data.full_name,
        link: data.html_url,
        owner: data.owner.login,
        permissions: data.permissions || {
            admin: false,
            maintain: false,
            push: false,
            pull: false,
            triage: false,
        },
    };
}
