import StorageService from '../models/services/cloud/storage-service';

export async function SAAddBucketPolicy({bucket, prefix, users, action}) {
    const storageService = new StorageService();

    await storageService.policy.allow({bucket, prefix, users, action});
}

SAAddBucketPolicy.displayName = 'sa-add-bucket-policy';
SAAddBucketPolicy.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
