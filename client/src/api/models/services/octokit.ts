import { Octokit as InternalOctokit } from 'octokit';
import { accessToken, customFetch } from '~/configs/server';

export function Octokit() {
    return new InternalOctokit({
        auth: accessToken,
        fetch: customFetch
    })
}