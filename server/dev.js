import 'dotenv/config';

import express from 'express';
import {router as quickstart} from './index.js';
import navigation from "./navigation.js";

const {
    PORT = 3000,
} = process.env;

const app = express();

app.use(quickstart({navigation, base: 'http://localhost:3001/'}));

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
    // $`open https://${HOST}`
});

