import type { IStrategy } from '@modelsjs/resolver';

export const PrefetchStrategy = Symbol('PrefetchResolveStrategy');

export const Prefetch: IStrategy = {
    kind: PrefetchStrategy,
};