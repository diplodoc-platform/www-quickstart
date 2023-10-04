import { SAGet } from './sa-get';
import { GhRepo } from './gh-repo';
import { AccessError } from '../errors';

import type {ModelContext} from '../../types';

const bucket = 'common-stable';

type Props = {
    repo: string;
    owner: string;
};

export async function DdProject({ repo, owner }: Props, ctx: ModelContext) {
    const { id, permissions } = await ctx.request(GhRepo, { repo, owner });

    if (permissions.admin !== true) {
        throw new AccessError(`User don't have admin permissions on '${owner}/${repo}' project.`);
    }

    return ctx.request(SAGet, { name: `${bucket}--gh-${id}-sa` });
}

DdProject.displayName = 'dd-project';
DdProject.displayProps = '*';
DdProject.displayResult = '*';
DdProject.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
