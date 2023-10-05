import { config } from './contig';

const state = config<{
    auth?: string;
    api?: string;
}>('urls');

export const auth = state.auth || '/auth';

export const api = state.api || '/api';