import AccessKeyService from '../models/services/cloud/access-key-service';

export async function SACreateAccessKey({description, serviceAccountId}) {
    const accessKeyService = new AccessKeyService();
    const {accessKey, secret} = await accessKeyService.create({description, serviceAccountId});

    return {
        accessKeyId: accessKey.keyId,
        secret
    };
}

SACreateAccessKey.displayName = 'sa-create-access-key';
SACreateAccessKey.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
