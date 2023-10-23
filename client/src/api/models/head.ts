import type { ModelContext } from '../../types';
import { join } from 'node:path';

import { S3GetObject } from './s3-get-object';

type Props = {
    bucket: string;
    prefix: string;
    nullable?: boolean;
};

export async function Head({ bucket, prefix, nullable }: Props, ctx: ModelContext) {
    const data = await ctx.request(S3GetObject, {
        bucket,
        key: join(prefix, 'head'),
        nullable
    });

    return JSON.parse(data);
}

Head.displayName = 'head';
Head.displayProps = '*';
Head.displayResult = [ 'revision' ];
