import 'dotenv/config';

import express from 'express';
import {router as quickstart} from './index.js';
import navigation from "./navigation.js";

const {
    PORT = 3000,
    BASE = '',
} = process.env;

const app = express();

app.use(BASE, quickstart({navigation, base: BASE}));

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
    // $`open https://${HOST}`
});

