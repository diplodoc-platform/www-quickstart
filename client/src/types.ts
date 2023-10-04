import type { Endpoints, OctokitResponse } from '@octokit/types';

export type GHResponse<R extends keyof Endpoints> = Endpoints[R]['response'] extends OctokitResponse<infer T> ? T : OJSON;
export type GHError = {
    status: number;
};

export type ModelAction<P extends OJSON = OJSON> = {
    (props: P, ctx: ModelContext): Promise<any>;
    displayName: string;
    displayProps?: string | Record<string, string>;
    displayResult?: string | Record<string, string | boolean>;
}

export type ModelContext = {
    request<A extends ModelAction<P>, P extends OJSON>(model: A, props?: P): Promise<ReturnType<A>>;
}