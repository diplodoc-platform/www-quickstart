import type { IStrategy } from '@modelsjs/resolver';

export const RequestStrategy = Symbol('ServerResolveStrategy');

export interface IRequestStrategy extends IStrategy {
    alias: string;
}

export type IRequestStrategyImpl = {
    [RequestStrategy]: IRequestStrategy;
}

export const Request = (alias: string): IRequestStrategy => ({
    kind: RequestStrategy,
    alias,
});