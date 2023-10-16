import { Octokit } from '../models/services/octokit'
import { RepoResult } from '../models/gh-repo';

import { accessToken } from '~/configs/server';

type Props = {
    owner: string;
    name: string;
    template: string;
};

export async function CreateRepo({ owner, name, template }: Props) {
    const octokit = Octokit()

    const [ template_owner, template_repo ] = template.split('/');

    const { status, data } = await octokit.request('POST /repos/{template_owner}/{template_repo}/generate', {
        template_owner,
        template_repo,
        owner,
        name,
        private: false,
    });

    return RepoResult(data);
}

CreateRepo.displayName = 'create-repo';
CreateRepo.displayProps = '*';
CreateRepo.displayTags = {
    'span.kind': 'client',
    'peer.service': 'cloud',
};
