import { Octokit } from 'octokit';
import { accessToken } from '~/configs/server';

type Props = {
    owner: string;
    repo: string;
};

export async function GhRepoPublicKey({ owner, repo }: Props) {
    const octokit = new Octokit({ auth: accessToken });

    const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', { owner, repo });

    return {
        id: data.key_id,
        key: data.key,
    };
}

GhRepoPublicKey.displayName = 'gh-repo-public-key';
GhRepoPublicKey.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};