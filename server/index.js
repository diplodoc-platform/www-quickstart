import * as dotenv from 'dotenv';
import express from 'express';
import session from 'cookie-session';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'url';
import {NodeKit} from '@gravity-ui/nodekit';
import {$} from 'zx';
import {App, Octokit} from 'octokit';
import jwt from 'jsonwebtoken';
import {gh, pem} from './gh.js'
import {withModels} from './models-runtime/index.js';

dotenv.config({path: '../.env'});

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
    PORT = 3000,
    HOST = 'localhost',
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_APP_ID,
    COOKIE_SECRET,
} = process.env;

const app = express();
const nodekit = new NodeKit({
    disableDotEnv: true,
    config: {
        appTracingEnabled: false,
    }
});

app.use(express.json());

app.use((req, res, next) => {
    req.ctx = res.ctx = nodekit.ctx.create(req.url);
    withModels(req, res);
    next();
});

app.use(session({
    name: 'session',
    keys: [COOKIE_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}));

app.get('/', async (req, res) => {
    const [
        app,
        manifest
    ] = await Promise.all([
        import('../client/build/server/app.cjs'),
        import('../client/build/client/manifest.json', {assert: {type: "json"}})
    ]);

    const bootstrap = Object.keys(manifest.default)
        .filter((key) => !key.endsWith('.map'))
        .map((key) => manifest.default[key].replace(/^auto/, '/static'))
        .reduce((acc, key) => {
            if (key.endsWith('.css')) {
                acc.styles.push(key);
            }

            if (key.endsWith('.cjs')) {
                acc.scripts.push(key);
            }

            return acc;
        }, {
            styles: [],
            scripts: []
        });

    const state = {
        api: {
            request: req.ctx.request.bind(req.ctx)
        },
        env: {
            isServer: true,
            isMobile: true,
            appId: Number(GITHUB_APP_ID)
        },
        server: {
            ...req.session,
            appPem: pem,
        },
        manifest: bootstrap
    };

    const {pipe} = app.default(state).render({
        url: req.url
    }, {
        bootstrapScripts: bootstrap.scripts,
        onShellReady() {
            res.setHeader('content-type', 'text/html');
            pipe(res);
        }
    });
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
    const accessToken = await getAccessToken(req.query);
    const user = await fetchGitHubUser(accessToken);

    if (user) {
        req.session.accessToken = accessToken;
        req.session.githubId = user.id;
        res.redirect('/');
    } else {
        res.send('Login did not succeed!')
    }
})

app.post('/api/attach-actions', async (req, res) => {
    console.log(req.body);
    const repo = req.body;

    const {data: {token}} = await gh.octokit.request('POST /app/installations/{id}/access_tokens', {
        id: repo.installation.id,
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": "Bearer " + jwt.sign({
                iat: Date.now() / 1000 | 0 - 60,
                exp: Date.now() / 1000 | 0 + 60,
                iss: GITHUB_APP_ID,
                alg: 'RS256',
            }, pem, {algorithm: 'RS256'}),
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    const opid = Math.random() * 1000000 | 0;

    await $`
        mkdir -p processing/${opid}
        cd processing/${opid}
        git init
        git remote add origin https://${token}@github.com/${repo.owner}/${repo.name}
        git fetch origin ${repo.main} --depth=1
        git checkout ${repo.main}
        git checkout -b diplodoc:init
    `;

    // const akit = await gh.getInstallationOctokit(repo.installation.id);

    // console.log(a);

    res.send({status: 'ok'});
})

app.listen(PORT, () => {
    // $`open https://${HOST}`
});

async function getAccessToken({code}) {
    // ghapp.octokit.auth()
    // ghapp.octokit.request('login/oauth/access_token', )

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