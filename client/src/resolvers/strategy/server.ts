import type { IStrategy } from '@modelsjs/resolver';
import type { ModelAction } from '../../types';

export const ServerStrategy = Symbol('ServerResolveStrategy');

interface IServerStrategy extends IStrategy {
    action: ModelAction
}

export type IServerStrategyImpl = {
    [ServerStrategy]: IServerStrategy;
}

export const Server = <P extends OJSON>(action: ModelAction): IServerStrategy => ({
    kind: ServerStrategy,
    action
});