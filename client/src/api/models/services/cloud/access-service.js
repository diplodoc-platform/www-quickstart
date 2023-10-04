import {serviceClients, cloudApi} from '@yandex-cloud/nodejs-sdk';
import Session from './session';

const {
    access: {
        access: {UpdateAccessBindingsRequest, AccessBindingAction},
    },
} = cloudApi;

export default function () {
    const session = new Session();
    const folderServiceClient = session.client(serviceClients.FolderServiceClient);

    return {
        folder: {
            update(resourceId, roleId, subjectId, subjectType) {
                return folderServiceClient.updateAccessBindings(
                    UpdateAccessBindingsRequest.fromPartial({
                        resourceId,
                        accessBindingDeltas: [
                            {
                                action: AccessBindingAction.ADD,
                                accessBinding: {
                                    roleId: roleId,
                                    subject: {
                                        id: subjectId,
                                        type: subjectType,
                                    },
                                },
                            },
                        ],
                    }),
                );
            },
        },
    };
};
