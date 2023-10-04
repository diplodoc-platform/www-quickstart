import AccessKeyService from '../models/services/cloud/access-key-service';
import {NotFoundError} from '../errors';

type Props = {
    serviceAccountId: string;
};

export async function SAGetAccessKey({serviceAccountId}: Props) {
    const accessKeyService = AccessKeyService();

    const keys = await accessKeyService.list(serviceAccountId, 1);

    if (!keys.length) {
        throw new NotFoundError(`Service account ${serviceAccountId} doesn't have any access key`);
    }

    return {
        accessKeyId: keys[0].keyId,
        secret: keys[0].secret,
    };
}

SAGetAccessKey.displayName = 'sa-get-access-keys';
SAGetAccessKey.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
