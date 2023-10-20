import { config } from './config';

const state = config<{
    auth?: string;
    api?: string;
    base?: string;
}>('urls');

export const auth = state.auth || '/auth';

export const api = state.api || '/api';

export const base = state.base || '';