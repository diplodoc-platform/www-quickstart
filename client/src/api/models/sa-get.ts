import ServiceAccountService from './services/cloud/service-account-service';
import { NotFoundError } from '../errors';

import { saResourceId } from '~/configs/server';

type Props = {
    name: string;
    nullable?: boolean;
};

export async function SAGet({ name, nullable }: Props) {
    const serviceAccountService = ServiceAccountService();
    const { serviceAccounts } = await serviceAccountService.list(saResourceId, `name="${ name }"`);

    if (serviceAccounts[0]) {
        return serviceAccounts[0];
    } else {
        if (nullable) {
            return null;
        }

        throw new NotFoundError('Service account not found');
    }
}

SAGet.displayName = 'sa-get';
SAGet.displayProps = '*';
SAGet.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
