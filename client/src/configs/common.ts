import { config } from './config';

const state = config<{
    nonce?: string;
    gtmId?: string;
}>('common');

export const nonce = state.nonce

export const gtmId = state.gtmId