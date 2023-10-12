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
} = process.env;

const app = express();

app.use('/static', express.static(path.join(__dirname, '../client/build')))

app.use(quickstart({navigation}));

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
});

