import {SAGet} from '../models/sa-get';
import ServiceAccountService from '../models/services/cloud/service-account-service';

import {saResourceId} from '~/configs/server';

export async function SACreate({name}, ctx) {
    const serviceAccountService = new ServiceAccountService();

    await serviceAccountService.create(saResourceId, name);

    return ctx.request(SAGet, {name});
}

SACreate.displayName = 'sa-create';
SACreate.displayProps = '*';
SACreate.displayResult = '*';
SACreate.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
