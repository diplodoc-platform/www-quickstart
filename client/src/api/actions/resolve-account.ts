import type { ServiceAccount } from '@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/iam/v1/service_account';
import type { ModelContext } from '../../types';

import { SAAddRole } from './sa-add-role';
import { SACreate } from './sa-create';
import { SAGet } from '../models/sa-get';

type Props = {
    name: string;
};

export async function ResolveAccount({ name }: Props, ctx: ModelContext) {
    let serviceAccount = await ctx.request(SAGet, { name, nullable: true }) as ServiceAccount;

    if (!serviceAccount) {
        serviceAccount = await ctx.request(SACreate, { name });

        await ctx.request(SAAddRole, { roleId: 'storage.uploader', subjectId: serviceAccount.id });
    }

    return serviceAccount;
}

ResolveAccount.displayName = 'create-account';
ResolveAccount.displayProps = '*';
ResolveAccount.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
