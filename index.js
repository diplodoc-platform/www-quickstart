import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'cookie-session';
import {$} from 'zx';

const {
    PORT = 3000,
    HAPROXY_DOMAIN = 'localhost',
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    COOKIE_SECRET,
} = process.env;

const app = express();

app.use(session({
    name: 'session',
    keys: [COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}));

app.get('/', async (req, res) => {
    if (req.session && req.session.access_token) {
        const user = await fetchGitHubUser(req.session.access_token);

        res.send(`Hello ${user.name} <pre> ${JSON.stringify(user, null, 2)}`);
    } else {
        res.redirect('/login/github');
    }
});

app.get('/logout', (req, res) => {
    if (req.session) {
        req.session = null;
    }

    res.redirect('/');
})

app.get('/login/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`)
});

app.get('/login/github/callback', async (req, res) => {
    const access_token = await getAccessToken(req.query);
    const user = await fetchGitHubUser(access_token);

    if (user) {
        req.session.access_token = access_token;
        req.session.githubId = user.id;
        res.redirect('/');
    } else {
        res.send('Login did not succeed!')
    }
})

app.listen(PORT, () => $`open https://${HAPROXY_DOMAIN}`);

async function getAccessToken({code}) {
    const request = await fetch('https://github.com/login/oauth/access_token', {
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

async function fetchGitHubUser(token) {
    const request = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: 'token ' + token,
        },
    });

    return await request.json();
}