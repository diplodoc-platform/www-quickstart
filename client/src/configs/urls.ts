import { config } from './config';

const state = config<{
    auth?: string;
    api?: string;
    base?: string;
    assetsPath?: string;
}>('urls');

export const auth = state.auth || '/auth';

export const api = state.api || '/api';

export const base = state.base || '';

export const assetsPath = state.assetsPath || 'https://storage.yandexcloud.net/diplodoc-www-assets'