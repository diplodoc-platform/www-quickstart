import type { ModelContext } from '../../types';
import { SAGet } from './sa-get';
import { GhRepo } from './gh-repo';
import { AccessError } from '../errors';

import { Head } from './head';
import { Deploy } from './deploy';

const bucket = 'common-stable';

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
    const { id: ghId, permissions } = await ctx.request(GhRepo, { repo, owner });
    const saName = `${ bucket }--gh-${ ghId }-sa`;

    if (permissions.admin !== true) {
        throw new AccessError(`User don't have admin permissions on '${owner}/${repo}' project.`);
    }

    const { id: saId } = await ctx.request(SAGet, { name: saName });
    const prefix = `gh-${saId}`;

    const head = await ctx.request(Head, { bucket, prefix, nullable: true });

    let deploy = null;
    if (!head) {
        deploy = await ctx.request(Deploy, { repo, owner });
    }

    return {
        name: prefix,
        link: `https://${bucket}--${prefix}.viewer.diplodoc.com`,
        deploy,
    };
}

Project.displayName = 'project';
Project.displayProps = '*';
Project.displayResult = '*';
Project.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
