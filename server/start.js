import 'dotenv/config';
import crypto from "node:crypto"
import express from 'express';

import {router as quickstart} from './index.js';
import navigation from "./navigation.js";
import getCSP from "./csp.js";


const {
    PORT = 3000,
} = process.env;

const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

const app = express();

app.use(function(req, res, next) {
    res.setHeader('x-nonce', nonce);
    res.setHeader('Content-Security-Policy', getCSP('123'));

    next();
});

app.use(quickstart({navigation}));

app.listen(PORT, () => {
    console.log('LISTEN ON ', PORT);
});

