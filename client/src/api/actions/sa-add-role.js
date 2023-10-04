import AccessService from '../models/services/cloud/access-service';

import {saResourceId} from '~/configs/server';

export async function SAAddRole({roleId, subjectId}) {
    const accessService = new AccessService();

    const subjectType = 'serviceAccount';

    await accessService.folder.update(saResourceId, roleId, subjectId, subjectType);
}

SAAddRole.displayName = 'sa-add-role';
SAAddRole.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
