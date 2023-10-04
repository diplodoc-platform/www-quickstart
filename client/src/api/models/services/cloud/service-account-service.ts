import {serviceClients, cloudApi} from '@yandex-cloud/nodejs-sdk';
import Session from './session';

const {
    iam: {
        service_account_service: {CreateServiceAccountRequest, ListServiceAccountsRequest},
    },
} = cloudApi;

export default function () {
    const session = Session();
    const serviceAccountServiceClient = session.client(serviceClients.ServiceAccountServiceClient);

    return {
        create(folderId: string, name: string) {
            return serviceAccountServiceClient.create(
                CreateServiceAccountRequest.fromPartial({
                    folderId,
                    name,
                }),
            );
        },

        list(folderId: string, filter: string) {
            return serviceAccountServiceClient.list(
                ListServiceAccountsRequest.fromPartial({
                    folderId,
                    filter,
                }),
            );
        },
    };
};
