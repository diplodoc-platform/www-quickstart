import { Octokit } from 'octokit';
import { RepoResult } from '../models/gh-repo';

import { accessToken } from '~/configs/server';

type Props = {
    owner: string;
    name: string;
    template: string;
};

export async function CreateRepo({ owner, name, template }: Props) {
    const octokit = new Octokit({ auth: accessToken });

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