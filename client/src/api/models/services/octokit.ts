import {Octokit as InternalOctokit} from 'octokit';

import { accessToken, fetch } from '~/configs/server';

export function Octokit() {
    if (!accessToken) {
        throw new Error('GitHub access token is not available. Please authenticate first.');
    }

    return new InternalOctokit({
        auth: accessToken,
        request: {
            fetch
        }
    })
}
