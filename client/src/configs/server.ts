import {config} from './contig';

if (!process.env.SERVER) {
    throw new Error('Session config is not accessible on client');
}

export type Server = {
    accessToken: string;
    appPem: string;
    saId: string;
    saSupervisorId: string;
    saAccessKey: string;
    saPrivateKey: string;
    saResourceId: string;
    fetch?: typeof global.fetch;
};

const state = config<Server>('server');

export const accessToken = state.accessToken;

export const appPem = state.appPem;

export const saId = state.saId;

export const saSupervisorId = state.saSupervisorId;

export const saAccessKey = state.saAccessKey;

export const saPrivateKey = state.saPrivateKey;

export const saResourceId = state.saResourceId;

export const fetch = state.fetch || global.fetch;