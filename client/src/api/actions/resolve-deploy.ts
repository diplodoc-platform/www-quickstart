import type { ModelContext } from '../../types';
import { Deploy } from '../models/deploy';
import { Octokit } from '../models/services/octokit';

type Props = {
    owner: string;
    repo: string;
};

export async function ResolveDeploy({ owner, repo }: Props, ctx: ModelContext) {
    const octokit = Octokit();
    const deploy = await ctx.request(Deploy, { owner, repo });

    if (!deploy) {
        await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner,
            repo,
            workflow_id: 'release.yml',
            ref: 'main',
        });

        return ctx.request(Deploy, { owner, repo, nocache: Date.now() });
    }

    return deploy;
}

ResolveDeploy.displayName = 'resolve-deploy';