import {config} from './config';

if (!process.env.SERVER) {
    throw new Error('Session config is not accessible on client');
}

export type S3Config = {
    endpoint: string;
    region: string;
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
    }
};

export type Server = {
    accessToken: string;
    appPem: string;
    saId: string;
    saSupervisorId: string;
    saAccessKey: string;
    saPrivateKey: string;
    saResourceId: string;
    s3config: S3Config;
    fetch?: typeof globalThis.fetch
    navigationEndpoint: string;
    commonBucketName: string;
    commonBucketEnv: string;
};

const state = config<Server>('server');

export const accessToken = state.accessToken;

export const saId = state.saId;

export const saSupervisorId = state.saSupervisorId;

export const saAccessKey = state.saAccessKey;

export const saPrivateKey = state.saPrivateKey;

export const saResourceId = state.saResourceId;

export const s3config = state.s3config;

export const fetch = state.fetch || globalThis.fetch;

export const navigationEndpoint = state.navigationEndpoint;

export const commonBucketName = state.commonBucketName;

export const commonBucketEnv = state.commonBucketEnv;
