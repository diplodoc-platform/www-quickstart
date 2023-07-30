import type { IStrategy } from '@modelsjs/resolver';

export const ServerStrategy = Symbol('ServerResolveStrategy');

interface IServerStrategy extends IStrategy {
    alias: string;
}

export const Server = {
    kind: ServerStrategy,
};