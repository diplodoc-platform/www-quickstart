import { config } from './config';

type Env = {
    isServer: boolean;

    isMobile: boolean;

    lang: string;
};

const state = config<Env>('env');

export const isServer = Boolean(process.env.SERVER);

export const isMobile = state.isMobile;

export const lang = state.lang || '';