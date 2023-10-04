import type { IStrategy } from '@modelsjs/resolver';

export const PrefetchStrategy = Symbol('PrefetchResolveStrategy');

export interface IPrefetchStrategy extends IStrategy {
    alias: string;
}

export type IPrefetchStrategyImpl = {
    [PrefetchStrategy]: IPrefetchStrategy;
}

export const Prefetch = (alias: string): IPrefetchStrategy => ({
    kind: PrefetchStrategy,
    alias,
});