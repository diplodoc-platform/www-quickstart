import type { ModelContext } from '../../types';
import { GhRepo } from '../models/gh-repo';
import { ResolveAccount } from './resolve-account';
import { SASaveSecret } from './sa-save-secret';
import { GhSaveSecret } from './gh-save-secret';
import { GhSaveVars } from './gh-save-vars';
import { ResolveCredentials } from './resolve-credentials';
import { AccessError } from '../errors';

const bucket = 'common-stable';

type Props = {
    id: number;
    repo: string;
    owner: string;
};

export async function CreateLink({ owner, repo }: Props, ctx: ModelContext) {
    // Check that user hase access to repo
    const { id, permissions } = await ctx.request(GhRepo, { repo, owner });

    if (!permissions.admin) {
        throw new AccessError(`User don't have admin permissions on '${ owner }/${ repo }' project.`);
    }

    const prefix = 'gh-' + id;
    const accountName = `${ bucket }--${ prefix }-sa`;

    const account = await ctx.request(ResolveAccount, { name: accountName, bucket, prefix });
    const credentials = await ctx.request(ResolveCredentials, { id: account.id, bucket, prefix });

    if (!credentials.secretAccessKey) {
        return;
    }

    await Promise.all([
        ctx.request(SASaveSecret, { name: accountName, credentials }),
        ctx.request(GhSaveSecret, {
            owner, repo, secrets: [
                { name: 'DIPLODOC_STORAGE_BUCKET', value: bucket },
                { name: 'DIPLODOC_ACCESS_KEY_ID', value: credentials.accessKeyId },
                { name: 'DIPLODOC_SECRET_ACCESS_KEY', value: credentials.secretAccessKey },
            ]
        }),
        ctx.request(GhSaveVars, {
            owner, repo, vars: [
                { name: 'DIPLODOC_STORAGE_REGION', value: 'ru-central1' },
                { name: 'DIPLODOC_STORAGE_ENDPOINT', value: 'https://storage.yandexcloud.net' },
                { name: 'DIPLODOC_PROJECT_NAME', value: prefix },
            ]
        }),
    ]);
}

CreateLink.displayName = 'create-link';
CreateLink.displayProps = '*';
CreateLink.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};