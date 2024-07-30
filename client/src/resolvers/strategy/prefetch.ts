import type { IStrategy } from '@modelsjs/resolver';

export const PrefetchStrategy = Symbol('PrefetchResolveStrategy');

export interface IPrefetchStrategy extends IStrategy {
    alias: string;
    error: boolean;
}

export type IPrefetchStrategyImpl = {
    [PrefetchStrategy]: IPrefetchStrategy;
}

export const Prefetch = (alias: string, error = false): IPrefetchStrategy => ({
    kind: PrefetchStrategy,
    alias,
    error,
});