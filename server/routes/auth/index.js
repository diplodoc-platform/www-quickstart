import {Octokit} from 'octokit';
import {Router} from 'express';
import {expectEnv} from '../../utils/envconfig.js';

const GITHUB_CLIENT_ID = expectEnv('GITHUB_CLIENT_ID')();
const GITHUB_CLIENT_SECRET = expectEnv('GITHUB_CLIENT_SECRET')();
const AUTH_SCOPES = ['public_repo'].join(',');

export const router = (router, customFetch = null) => {
    router.get('/login/github', (req, res) => {
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${AUTH_SCOPES}`)
    });

    router.get('/login/github/callback', async (req, res) => {
        let accessToken;
        let user;
        try {
            const accessToken = await getAccessToken(req.query, customFetch);
            user = await fetchGitHubUser(accessToken, customFetch);
        } catch (err) {
            res.status(403);
            res.send('Could not fetch github user info');
            return;
        }

        if (user) {
            req.session.accessToken = accessToken;
            req.session.githubId = user.id;

            res.redirect(req.baseUrl || '/');
        } else {
            res.status(403);
            res.send('Login did not succeed!')
        }
    });

    router.get('/logout', (req, res) => {
        if (req.session) {
            req.session = null;
        }

        res.redirect(req.baseUrl || '/');
    });

    return router;
};

async function getAccessToken({code}, customFetch = null) {
    const fetchFunction = customFetch ? customFetch : fetch
    const request = await fetchFunction('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
        }),
    });

    const text = await request.text();
    const params = new URLSearchParams(text);

    return params.get("access_token");
}

async function fetchGitHubUser(accessToken, customFetch = null) {
    const octokit = new Octokit({auth: accessToken, ...(customFetch ? {request: {fetch: customFetch}} : {})})

    const result = await octokit.request('GET /user');

    return result.data;
}
