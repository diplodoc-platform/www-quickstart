import { Octokit } from '../models/services/octokit';

type Props = {
    owner: string;
    repo: string;
    vars: { name: string, value: string }[]
};

export async function GHSaveVars({ owner, repo, vars }: Props) {
    const octokit = Octokit();

    await Promise.all(vars.map(async ({ name, value }) => {
        return octokit.request('POST /repos/{owner}/{repo}/actions/variables', {
            owner,
            repo,
            name,
            value,
        })
    }));

    return {};
}

GHSaveVars.displayName = 'gh-save-vars';
GHSaveVars.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};
