import { Octokit } from 'octokit';
import { accessToken } from '~/configs/server';

type Props = {
    owner: string;
    repo: string;
    vars: { name: string, value: string }[]
};

export async function GhSaveVars({ owner, repo, vars }: Props) {
    const octokit = new Octokit({ auth: accessToken });

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

GhSaveVars.displayName = 'gh-save-vars';
GhSaveVars.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};