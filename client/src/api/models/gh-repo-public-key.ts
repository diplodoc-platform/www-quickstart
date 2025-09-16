import { Octokit } from './services/octokit';
import type { ModelContext } from '../../types';

type Props = {
    owner: string;
    repo: string;
};

export async function GhRepoPublicKey({ owner, repo }: Props, ctx: ModelContext) {
    const octokit = Octokit();

    try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', { owner, repo });

        return {
            id: data.key_id,
            key: data.key,
        };
    } catch (error) {
        ctx.logger.error(error, `GitHub API error fetching public key for ${owner || 'undefined'}/${repo || 'undefined'}`, {
            owner,
            repo,
            errorStatus: (error as any)?.status,
            errorMessage: (error as Error)?.message
        });
        throw error;
    }
}

GhRepoPublicKey.displayName = 'gh-repo-public-key';
GhRepoPublicKey.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};
