import 'dotenv/config';

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import {router as quickstart} from './index.js';
import navigation from "./navigation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
    PORT = 3000,
    BASE = '',
    EXPRESS_STATIC
} = process.env;

const STATIC_BASE = process.env.STATIC_BASE ?? (BASE + '/static');

const app = express();

if (EXPRESS_STATIC) {
    app.use(STATIC_BASE, express.static(path.join(__dirname, '../client/build')))
}

// app.use('/:lang*?' + BASE, (req, res, next) => {
//     req.lang = req.params.lang;
//     next();
// }, quickstart({navigation, base: BASE, staticBase: STATIC_BASE}));

app.use(quickstart({navigation, base: BASE, staticBase: STATIC_BASE}));

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
});

