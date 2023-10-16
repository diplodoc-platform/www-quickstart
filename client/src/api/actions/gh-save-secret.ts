import sodium from 'libsodium-wrappers';
import { Octokit } from '../models/services/octokit';
import { accessToken } from '~/configs/server';
import { GhRepoPublicKey } from '../models/gh-repo-public-key';
import { ModelContext } from '../../types';

type Props = {
    owner: string;
    repo: string;
    secrets: { name: string, value: string }[]
};

export async function GhSaveSecret({ owner, repo, secrets }: Props, ctx: ModelContext) {
    const octokit = Octokit();
    const { key, id: keyId } = await ctx.request(GhRepoPublicKey, { owner, repo });

    await Promise.all(secrets.map(async ({ name, value }) => octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner,
        repo,
        key_id: keyId,
        secret_name: name,
        encrypted_value: await encrypt(key, value),
    })));
}

GhSaveSecret.displayName = 'gh-save-secret';
GhSaveSecret.displayTags = {
    'span.kind': 'client',
    'peer.service': 'github',
};

async function encrypt(key: string, secret: string) {
    await sodium;

    const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
    const binsec = sodium.from_string(secret);
    const encBytes = sodium.crypto_box_seal(binsec, binkey);

    return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
}
