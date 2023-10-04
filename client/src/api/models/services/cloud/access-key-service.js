import {serviceClients, cloudApi} from '@yandex-cloud/nodejs-sdk';
import Session from './session';

const {
    iam: {
        access_key_service: {CreateAccessKeyRequest, ListAccessKeysRequest},
    },
} = cloudApi;

export default function () {
    const session = new Session();
    const accessKeyServiceClient = session.client(serviceClients.AccessKeyServiceClient);

    return {
        async list(serviceAccountId, max) {
            max = max || 150;

            const keys = [];
            let nextPageToken, accessKeys;

            while (keys.length < max) {
                ({accessKeys, nextPageToken} = await accessKeyServiceClient.list(
                    ListAccessKeysRequest.fromPartial({
                        pageSize: 50,
                        pageToken: nextPageToken,
                        serviceAccountId,
                    }),
                ));

                keys.push(...accessKeys);

                if (!nextPageToken) {
                    return keys;
                }
            }

            return keys;
        },

        create({description, serviceAccountId}) {
            return accessKeyServiceClient.create(
                CreateAccessKeyRequest.fromPartial({
                    description,
                    serviceAccountId,
                }),
            );
        },
    };
};
