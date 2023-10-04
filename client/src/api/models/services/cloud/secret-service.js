import {serviceClients, cloudApi} from '@yandex-cloud/nodejs-sdk';
import Session from './session';

const {
    lockbox: {
        secret_service: {CreateSecretRequest},
    },
} = cloudApi;

export default function () {
    const session = Session();
    const secretServiceClient = session.client(serviceClients.SecretServiceClient);

    return {
        create({description, name, folderId, versionPayloadEntries}) {
            return secretServiceClient.create(
                CreateSecretRequest.fromPartial({
                    description,
                    folderId,
                    name,
                    versionPayloadEntries,
                }),
            );
        },
    };
};
