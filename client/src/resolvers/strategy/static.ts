import type { IStrategy } from '@modelsjs/resolver';

export const StaticStrategy = Symbol('StaticResolveStrategy');

interface IStaticStrategy extends IStrategy {
    data: any;
}

export const Static = (data: any): IStaticStrategy => ({
    kind: StaticStrategy,
    data
});