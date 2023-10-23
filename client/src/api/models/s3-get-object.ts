import type { ModelContext } from '../../types';
import S3 from './services/s3';
import { NotFoundError } from '../errors';

type Props = {
    bucket: string;
    key: string;
    nullable?: boolean;
    raw?: boolean;
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
};

export async function S3GetObject({bucket, key, nullable, raw, credentials}: Props, ctx: ModelContext) {
    const s3 = S3(credentials ? {credentials} : null);

    try {
        const result = await s3.getObject(bucket, key);
        return raw ? result : result.Body.toString('utf8');
    } catch (error) {
        if (error.Code === 'NoSuchKey') {
            if (nullable) {
                return null;
            } else {
                throw new NotFoundError(error.message);
            }
        }

        throw error;
    }
}

S3GetObject.displayName = 's3-get-object';
S3GetObject.displayProps = {
    bucket: true,
    key: true,
    nullable: true,
    raw: true,
    credentials: ({credentials}) => (credentials ? 'custom' : 'default'),
};
S3GetObject.displayTags = {
    'span.kind': 'client',
    'peer.service': 's3',
};
