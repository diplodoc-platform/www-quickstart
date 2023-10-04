import type { ModelContext } from '../../types';
import { SAGetAccessKey } from './sa-get-access-key';
import { SACreateAccessKey } from './sa-create-access-key';
import { SASaveSecret } from './sa-save-secret';
import { NotFoundError } from '../errors';

type Props = {
    id: string;
    bucket: string;
    prefix: string;
};

export async function ResolveCredentials({ id: serviceAccountId, bucket, prefix }: Props, ctx: ModelContext) {
    let accessKeyId, secret;
    try {
        ({ accessKeyId, secret } = await ctx.request(SAGetAccessKey, { serviceAccountId }));
    } catch (error) {
        if (!(error instanceof NotFoundError)) {
            throw error;
        }
    }

    if (!accessKeyId) {
        let description = `Api key for bucket ${ bucket }`;
        if (prefix) {
            description += ` with prefix ${ prefix }`;
        }

        ({ accessKeyId, secret } = await ctx.request(SACreateAccessKey, { description, serviceAccountId }));
    }

    return {
        accessKeyId,
        secretAccessKey: secret,
    };
}

ResolveCredentials.displayName = 'resolve-credentials';
ResolveCredentials.displayProps = '*';
ResolveCredentials.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
