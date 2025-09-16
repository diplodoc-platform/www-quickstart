import { Octokit } from '../models/services/octokit'
import { RepoResult } from '../models/gh-repo';
import type { ModelContext } from '../../types';

type Props = {
    owner: string;
    name: string;
    template: string;
};

export async function CreateRepo({ owner, name, template }: Props, ctx: ModelContext) {
    const octokit = Octokit();

    try {
        const [ template_owner, template_repo ] = template.split('/');

        const { data } = await octokit.request('POST /repos/{template_owner}/{template_repo}/generate', {
            template_owner,
            template_repo,
            owner,
            name,
            private: false,
        });

        return RepoResult(data);
    } catch (error) {
        ctx.logger.error(error, `GitHub API error creating repository ${owner || 'undefined'}/${name || 'undefined'}`, {
            owner,
            name,
            template,
            errorStatus: (error as any)?.status,
            errorMessage: (error as Error)?.message
        });
        throw error;
    }
}

CreateRepo.displayName = 'create-repo';
CreateRepo.displayProps = '*';
CreateRepo.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
