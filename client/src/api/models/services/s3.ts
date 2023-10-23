import type { S3Config } from '~/configs/server';

import { Buffer } from 'node:buffer';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

import { s3config } from '~/configs/server';

export default function S3(config: Partial<S3Config>) {
    const s3 = new S3Client({ ...s3config, ...(config || {}) });

    return {
        async getObject(Bucket, Key) {
            const response = await s3.send(new GetObjectCommand({ Bucket, Key }));

            response.Body = (await response.Body.toArray()).reduce((prev, next) =>
                Buffer.concat([ prev, next ]),
            );

            return response;
        },
    };
}