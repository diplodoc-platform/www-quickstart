import type { ModelContext } from '../../types';
import { Deploy } from '../models/deploy';
import { Octokit } from '../models/services/octokit';
import {retrier} from "../../utils/common";

type Props = {
    owner: string;
    repo: string;
};

export async function ResolveDeploy({ owner, repo }: Props, ctx: ModelContext) {
    const octokit = Octokit();

    try {
        const deploy = await ctx.request(Deploy, { owner, repo });

        if (!deploy) {
            await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
                owner,
                repo,
                workflow_id: 'release.yml',
                ref: 'main',
            });

            return await retrier(async () => await ctx.request(Deploy, { owner, repo, nocache: Date.now() }), {attempts: 5, delay: 1000});
        }

        return deploy;
    } catch (error) {
        ctx.logger.error(error, `GitHub API error triggering deploy for ${owner || 'undefined'}/${repo || 'undefined'}`, {
            owner,
            repo,
            errorStatus: (error as any)?.status,
            errorMessage: (error as Error)?.message
        });
        throw error;
    }
}

ResolveDeploy.displayName = 'resolve-deploy';
