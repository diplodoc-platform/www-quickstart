import * as dotenv from 'dotenv';
import {readFileSync} from "fs";
import {App} from "octokit";
import {resolve} from "node:path";

dotenv.config({path: '../.env'});

const {
    GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY_PATH,
} = process.env;

export const pem = readFileSync(resolve('../', GITHUB_APP_PRIVATE_KEY_PATH));

export const gh = new App({
    appId: GITHUB_APP_ID,
    privateKey: pem,
});