import type { ModelContext } from '../../types';
import { Octokit } from './services/octokit';
import { GhUser } from './gh-user';

type Props = {
    repo: string;
    owner: string;
};

export interface Result {
    id: string;
    name: string;
    link?: string;
    deploy?: string;
};

export async function Deploy({ repo, owner }: Props, ctx: ModelContext) {
    const octokit = Octokit();

    if (!owner) {
        const user = await ctx.request(GhUser);

        owner = user.login;
    }

    const deploy = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
        owner,
        repo,
        workflow_id: 'release.yml',
    });

    // const run = deploy.data.workflow_runs.filter((run) => run.status !== 'complete')[0];
    const run = deploy.data.workflow_runs[0];

    if (!run) {
        return null;
    }

    return {
        id: run.id,
        link: run.html_url
    };
}

Deploy.displayName = 'deploy';
Deploy.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};


