import type { GHResponse, GHError } from '../../types';
import { Octokit } from './services/octokit';
import { NotFoundError } from '../errors';
import { login } from '~/configs/user';

type Props = {
    owner: string;
    repo: string;
};

export async function GhRepo({ owner, repo }: Props): Promise<ReturnType<typeof RepoResult>> {
    const octokit = Octokit();

    try {
        owner = owner || login;

        const result = await octokit.request('GET /repos/{owner}/{repo}', { owner, repo });
        const { data } = result;

        return RepoResult(data);
    } catch (error) {
        switch ((error as GHError)?.status) {
            case 404:
                return {};
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
