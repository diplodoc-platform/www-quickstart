import {Octokit as InternalOctokit} from 'octokit';

import { accessToken, fetch } from '~/configs/server';

export function Octokit() {
    return new InternalOctokit({
        auth: accessToken,
        request: {
            fetch
        }
    })
}
