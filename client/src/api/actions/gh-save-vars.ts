import { Octokit } from '../models/services/octokit';
import type { ModelContext } from '../../types';

type Props = {
    owner: string;
    repo: string;
    vars: { name: string, value: string }[]
};

export async function GHSaveVars({ owner, repo, vars }: Props, ctx: ModelContext) {
    const octokit = Octokit();

    try {
        await Promise.all(vars.map(async ({ name, value }) => {
            return octokit.request('POST /repos/{owner}/{repo}/actions/variables', {
                owner,
                repo,
                name,
                value,
            })
        }));

        return {};
    } catch (error) {
        ctx.logger.error(error, `GitHub API error saving variables to ${owner || 'undefined'}/${repo || 'undefined'}`, {
            owner,
            repo,
            errorStatus: (error as any)?.status,
            errorMessage: (error as Error)?.message
        });
        throw error;
    }
}

GHSaveVars.displayName = 'gh-save-vars';
GHSaveVars.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};
