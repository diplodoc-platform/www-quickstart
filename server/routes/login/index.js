import {Octokit} from 'octokit';
import {Router} from 'express';

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
} = process.env;

export const router = new Router();

const SCOPES = [
    'public_repo',
].join(',');

router.get('/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${SCOPES}`)
});

router.get('/github/callback', async (req, res) => {
    const accessToken = await getAccessToken(req.query);
    const user = await fetchGitHubUser(accessToken);

    if (user) {
        req.session.accessToken = accessToken;
        req.session.githubId = user.id;
        res.redirect('/');
    } else {
        res.status(403);
        res.send('Login did not succeed!')
    }
})

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

async function fetchGitHubUser(accessToken) {
    const octokit = new Octokit({auth: accessToken});

    const result = await octokit.request('GET /user');

    return result.data;
}