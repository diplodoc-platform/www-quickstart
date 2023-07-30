import * as dotenv from 'dotenv';
import express from 'express';
import session from 'cookie-session';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'url';
import {NodeKit} from '@gravity-ui/nodekit';
import {$} from 'zx';
import gh from './gh.js'
import {withModels} from './models-runtime/index.js';

dotenv.config({path: '../.env'});


const __dirname = dirname(fileURLToPath(import.meta.url));

const {
    PORT = 3000,
    HOST = 'localhost',
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY_PATH,
    COOKIE_SECRET,
} = process.env;

const app = express();
const nodekit = new NodeKit({
    disableDotEnv: true,
    config: {
        appTracingEnabled: false,
    }
});
const ghapp = gh(GITHUB_APP_ID, resolve(__dirname, '../', GITHUB_APP_PRIVATE_KEY_PATH));

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
    const state = {
        api: {
            request: req.ctx.request.bind(req.ctx)
        },
        session: req.session
    };
    const [
        app
    ] = await Promise.all([
        import('../client/build/server/app.cjs')
    ]);

    // if (req.session.access_token) {
    //     const user = await fetchGitHubUser(req.session.access_token);
    // }

    const {pipe} = app.default(state).render({
        url: req.url
    }, {
        bootstrapScripts: [
            '/static/client/runtime.cjs',
            '/static/client/app.cjs',
            '/static/client/vendors-node_modules_react-dom_client_js-node_modules_react-router-dom_dist_index_js-node_mod-36f44b.cjs',
        ],
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

app.listen(PORT, () => {
    // $`open https://${HOST}`
});

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