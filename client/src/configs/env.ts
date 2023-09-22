import { config } from './contig';

type Env = {
    isServer: boolean;

    isMobile: boolean;

    appId: number;
};

const state = config<Env>('env');

export const isServer = Boolean(process.env.SERVER);

export const isMobile = state.isMobile;

export const appId = state.appId;