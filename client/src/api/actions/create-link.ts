import type { ModelContext } from '../../types';
import { Head } from '../models/head';
import { GhRepo } from '../models/gh-repo';
import { ResolveAccount } from './resolve-account';
import { SASaveSecret } from './sa-save-secret';
import { GHSaveSecret } from './gh-save-secret';
import { GHSaveVars } from './gh-save-vars';
import { ResolveDeploy } from './resolve-deploy';
import { ResolveCredentials } from './resolve-credentials';
import { AccessError } from '../errors';

import { s3config } from '~/configs/server';

const bucket = 'common-stable';

type Props = {
    id: number;
    repo: string;
    owner: string;
};

export async function CreateLink({ owner, repo }: Props, ctx: ModelContext) {
    // Check that user hase access to repo
    const { id: ghId, permissions } = await ctx.request(GhRepo, { repo, owner });
    const saName = `${ bucket }--gh-${ ghId }-sa`;

    if (!permissions.admin) {
        throw new AccessError(`User don't have admin permissions on '${ owner }/${ repo }' project.`);
    }

    const { id: saId } = await ctx.request(ResolveAccount, { name: saName });
    const prefix = `gh-${ saId }`;

    const [ head, creds ] = await Promise.all([
        ctx.request(Head, { bucket, prefix, nullable: true }),
        ctx.request(ResolveCredentials, { id: saId, bucket, prefix })
    ]);

    if (creds.secretAccessKey) {
        await Promise.all([
            ctx.request(SASaveSecret, { name: saName, credentials: creds }),
            ctx.request(GHSaveSecret, {
                owner, repo, secrets: [
                    { name: 'DIPLODOC_ACCESS_KEY_ID', value: creds.accessKeyId },
                    { name: 'DIPLODOC_SECRET_ACCESS_KEY', value: creds.secretAccessKey },
                ]
            }),
            ctx.request(GHSaveVars, {
                owner, repo, vars: [
                    { name: 'DIPLODOC_STORAGE_BUCKET', value: bucket + '/' + prefix },
                    { name: 'DIPLODOC_STORAGE_REGION', value: s3config.region },
                    { name: 'DIPLODOC_STORAGE_ENDPOINT', value: s3config.endpoint },
                ]
            }),
        ]);
    }

    let deploy = null;
    if (!head) {
        deploy = await ctx.request(ResolveDeploy, { owner, repo });
    }

    return {
        name: prefix,
        link: `https://${bucket}---${prefix}.viewer.diplodoc.com`,
        deploy,
    };
}

CreateLink.displayName = 'create-link';
CreateLink.displayProps = '*';
CreateLink.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};