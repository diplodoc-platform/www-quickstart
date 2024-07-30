import type { Endpoints, OctokitResponse } from '@octokit/types';
import {ButtonProps} from "@gravity-ui/page-constructor";

export type GHResponse<R extends keyof Endpoints> = Endpoints[R]['response'] extends OctokitResponse<infer T> ? T : OJSON;
export type GHError = {
    status: number;
};

export type ModelAction<P extends OJSON = OJSON> = {
    (props: P, ctx: ModelContext): Promise<any>;
    displayName: string;
    displayProps?: string | Record<string, string | boolean | Function>;
    displayResult?: string | string[] | Record<string, string | boolean | Function>;
}

export type ModelContext = {
    request<A extends ModelAction<P>, P extends OJSON>(model: A, props?: P): Promise<ReturnType<A>>;
    logger: {
        error: Function;
        warn: Function;
        log: Function;
    };
}

export type ConsentButtonsPopupProps = Record<'decline' | 'accept', ButtonProps>;

export interface ConsentPopupData {
    text: string;
    buttons: ConsentButtonsPopupProps;
}