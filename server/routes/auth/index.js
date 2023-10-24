import {Router} from 'express';
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

export const router = (customFetch = null, base = '/') => {
    const router = new Router();

    router.get('/login/github', (req, res) => {
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${AUTH_SCOPES}`)
    });

    router.get('/login/github/callback', async (req, res) => {
        let accessToken;
        let user;
        try {
            accessToken = await getAccessToken(req.query, customFetch);
            user = await fetchGitHubUser(accessToken, customFetch);
        } catch (err) {
            res.status(403);
            res.send('Could not fetch github user info');
            return;
        }

        if (user) {
            req.session.accessToken = accessToken;
            req.session.githubId = user.id;

            res.redirect(base || '/');
        } else {
            res.status(403);
            res.send('Login did not succeed!')
        }
    });

    router.get('/logout', (req, res) => {
        if (req.session) {
            req.session = null;
        }

        res.redirect(base || '/');
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
            client_id: clientId,
            client_secret: clientSecret,
            code,
        }),
    });

    const text = await request.text();
    const params = new URLSearchParams(text);

    return params.get("access_token");
}

export async function fetchGitHubUser(accessToken, customFetch = null) {
    const octokit = new Octokit({auth: accessToken, ...(customFetch ? {request: {fetch: customFetch}} : {})})

    const {data} = await octokit.request('GET /user');

    return {
        id: data.id,
        name: data.name,
        login: data.login,
        link: data.html_url,
        avatar: data.avatar_url
    };
}
