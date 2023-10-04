import SecretService from '../models/services/cloud/secret-service';

import { saResourceId } from '~/configs/server';

type Props = {
    name: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    }
};

export async function SASaveSecret({ name: accountName, credentials }: Props) {
    const secretService = SecretService();

    await secretService.create({
        folderId: saResourceId,
        name: accountName,
        description: `Secret for ${ accountName }`,
        versionPayloadEntries: [
            {
                key: 'accessKeyId',
                textValue: credentials.accessKeyId,
            },
            {
                key: 'secretAccessKey',
                textValue: credentials.secretAccessKey,
            },
        ],
    });
}

SASaveSecret.displayName = 'sa-save-secret';
SASaveSecret.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
