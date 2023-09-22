import {config} from './contig';

if (!process.env.SERVER) {
    throw new Error('Session config is not accessible on client');
}

type Server = {
    accessToken: string;
    appPem: string;
};

const state = config<Server>('server');

export const accessToken: string = state.accessToken;

export const appPem: string = state.appPem;