import type { ModelContext } from '../../types';
import { SAGet } from './sa-get';
import { GhRepo } from './gh-repo';
import { NotFoundError } from '../errors';

import { Head } from './head';
import { Deploy } from './deploy';
import { commonBucketEnv, commonBucketName } from '~/configs/server';

const commonBucket = `${commonBucketName}-${commonBucketEnv}`;

type Props = {
    repo: string;
    owner: string;
};

export interface Result {
    name: string;
    link?: string;
    deploy?: string;
};

export async function Project({ repo, owner }: Props, ctx: ModelContext) {
    try {
        const { id: ghRepoId } = await ctx.request(GhRepo, { repo, owner });
        const saName = `${ commonBucket }--gh-${ ghRepoId }-sa`;

        if (!ghRepoId) {
            throw new NotFoundError(`Repository ${owner}/${repo} not found or not accessible`);
        }

        const { id: saId } = await ctx.request(SAGet, { name: saName });
        const prefix = `gh-${saId}`;

        const head = await ctx.request(Head, { bucket: commonBucket, prefix, nullable: true });

        let deploy = null;
        if (!head) {
            deploy = await ctx.request(Deploy, { repo, owner });
        }

        return {
            id: saId,
            name: prefix,
            link: `https://${commonBucketName}---${prefix}.viewer.diplodoc.com`,
            deploy,
        };
    } catch (e) {
        return {};
    }
}

Project.displayName = 'project';
Project.displayProps = '*';
Project.displayResult = '*';
Project.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
