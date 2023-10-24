import { config } from './config';

type User = {
    id: string;

    name: string;

    login: string;

    link: string;

    avatar: string;

    sign: string;
};

const state = config<User>('user');

export const id = state.id;

export const name = state.name;

export const login = state.login;

export const link = state.link;

export const avatar = state.avatar
;
export const sign = state.sign;