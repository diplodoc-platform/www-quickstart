import { SAAddBucketPolicy } from './sa-add-bucket-policy';
import { SAAddRole } from './sa-add-role';
import { SACreate } from './sa-create';

import { saSupervisorId } from '~/configs/server';
import { ModelContext } from '../../types';
import { SAGet } from '../models/sa-get';
import { NotFoundError } from '../errors';

type Props = {
    name: string;
    bucket: string;
    prefix: string;
};

export async function ResolveAccount({ name, bucket, prefix }: Props, ctx: ModelContext) {
    let serviceAccount;
    try {
        serviceAccount = await ctx.request(SAGet, {name});
    } catch (error) {
        if (!(error instanceof NotFoundError)) {
            throw error;
        }
    }

    if (!serviceAccount) {
        serviceAccount = await ctx.request(SACreate, { name });

        await Promise.all([
            ctx.request(SAAddRole, { roleId: 'storage.uploader', subjectId: serviceAccount.id }),
            ctx.request(SAAddBucketPolicy, {
                bucket,
                prefix,
                users: [ saSupervisorId, serviceAccount.id ],
                action: '*',
            }),
        ]);
    }

    return serviceAccount;
}

ResolveAccount.displayName = 'create-account';
ResolveAccount.displayProps = '*';
ResolveAccount.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
