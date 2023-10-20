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

const app = express();

if(EXPRESS_STATIC) {
    app.use(BASE + '/static', express.static(path.join(__dirname, '../client/build')))
}

app.use(BASE, quickstart({navigation, base: BASE}));
app.use('/en' + BASE, quickstart({navigation, base: '/en' + BASE}));

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
});

