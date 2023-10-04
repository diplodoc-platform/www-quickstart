import 'dotenv/config';

import express from 'express';
import {router as quickstart} from './index.js';

const {
    PORT = 3000,
} = process.env;

const app = express();

app.use(quickstart);

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
    // $`open https://${HOST}`
});

