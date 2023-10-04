import type { IStrategy } from '@modelsjs/resolver';

export const StaticStrategy = Symbol('StaticResolveStrategy');

interface IStaticStrategy extends IStrategy {
    data: OJSON;
}

export type IStaticStrategyImpl = {
    [StaticStrategy]: IStaticStrategy;
}

export const Static = (data: OJSON): IStaticStrategy => ({
    kind: StaticStrategy,
    data
});