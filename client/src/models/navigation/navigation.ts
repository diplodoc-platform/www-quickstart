import type {ButtonProps} from '@gravity-ui/page-constructor';
import {Model} from '@modelsjs/model';
import {resolvable} from '@modelsjs/resolver';
import {Prefetch} from '~/resolvers/strategy';
import {
    FooterData,
    HeaderData,
    ThemedNavigationLogoData
} from "@gravity-ui/page-constructor/build/esm/models/navigation";

export interface MetaData {
    title: string;
    description?: string;
    sharing?: SharingMeta;
}

export interface SharingMeta {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string | string[];
    canonical?: string;
}

export interface AnalyticsData {
    id: string;
    popup: ConsentPopupData;
}

export type ConsentButtonsPopupProps = Record<'decline' | 'accept', ButtonProps>;

export interface ConsentPopupData {
    text: string;
    buttons: ConsentButtonsPopupProps;
}

@resolvable(Prefetch('navigation'))
export class Navigation extends Model {
    header: HeaderData;
    logo: ThemedNavigationLogoData;
    footer?: FooterData;
    meta: MetaData;
    favicon: {
        folder: string;
    }
    analytics: AnalyticsData
}