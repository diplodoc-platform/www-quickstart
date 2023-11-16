import {Router} from 'express';
import { join } from 'node:path';
import {randomBytes} from 'crypto';
import {Octokit} from 'octokit';
import envConfig, {expectEnv} from '../../utils/envconfig.js';

const {clientId, clientSecret} = envConfig({
    common: {
        clientId: expectEnv('GITHUB_CLIENT_ID')(),
        clientSecret: expectEnv('GITHUB_CLIENT_SECRET')()
    },
    development: {
        clientId: expectEnv('GITHUB_CLIENT_ID_DEV')(),
        clientSecret: expectEnv('GITHUB_CLIENT_SECRET_DEV')()
    }
});

const AUTH_SCOPES = ['public_repo'].join(',');

export const router = () => {
    const router = new Router();
    const githubState = new Map()

    router.get('/login/github', (req, res) => {
        const state = randomBytes(20).toString('hex');
        const lang = req.get('Referrer')?.split('/')?.includes('en') ? 'en' : '';
        githubState.set(state, lang)

        res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${AUTH_SCOPES}&state=${state}`)
    });

    router.get('/login/github/callback', async (req, res) => {
        let accessToken;
        let user;
        const state = req.query?.state;

        if(!state || !githubState.has(state)) {
            res.status(403);
            res.send('Could not get github state back');
            return;
        }

        try {
            accessToken = await getAccessToken(req.query, req.fetch);
            user = await fetchGitHubUser(accessToken, req.fetch);
        } catch (err) {
            res.status(403);
            res.send('Could not fetch github user info');
            return;
        }

        if (user) {
            req.session.accessToken = accessToken;
            req.session.githubId = user.id;

            res.redirect(join('/', githubState.get(state), req.base || ''));
        } else {
            res.status(403);
            res.send('Login did not succeed!')
        }
    });

    router.get('/logout', (req, res) => {
        if (req.session) {
            req.session = null;
        }

        res.redirect(req.base || '/');
    });

    return router;
};

async function getAccessToken({code}, fetch) {
    const request = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
        }),
    });

    const text = await request.text();
    const params = new URLSearchParams(text);

    return params.get("access_token");
}

export async function fetchGitHubUser(accessToken, fetch) {
    const octokit = new Octokit({
        auth: accessToken,
        request: {
            fetch: fetch
        },
    });

    const {data} = await octokit.request('GET /user');

    return {
        id: data.id,
        name: data.name,
        login: data.login,
        link: data.html_url,
        avatar: data.avatar_url
    };
}
