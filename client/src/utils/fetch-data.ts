import {getEnv} from './common';
import withCache, {MINUTE} from './cache';

const NAVIGATION_FILE_NAME = process.env.NAVIGATION_FILE_NAME;
const PRODUCTION_CACHE_TIME = Number(process.env.CACHE_TIME) || MINUTE * 5;

const SECOND = 1;
const TTL = getEnv() === 'prod' ? PRODUCTION_CACHE_TIME : SECOND;

export enum Locale {
    En = 'en',
    Ru = 'ru',
}

interface ResponseError extends Error {
    statusCode?: number;
}

export type ConstructorPageContent = PageContent<ConstructorPageContentBase>;

export interface ContentResponseType {
    statusCode: number;
    error?: string;
    data?: ConstructorPageContent;
}

export interface ApiResponseType extends Omit<ContentResponseType, 'data'> {
    data?: string;
}

async function fetchPublicData(fileName: string, locale: Locale, config) {
    const {
        navigationEndpoint,
    } = config;

    const res = await fetch(
        `${navigationEndpoint}/${locale}/published/${fileName}.yaml`,
    );

    return {status: res.status, data: res.ok ? await res.text() : res.statusText};
}

async function getContent(fileName: string, locale: Locale, config) {
    try {
        const {status, data} = await fetchPublicData(fileName, locale, config);

        return {statusCode: status, data};
    } catch (error) {
        return {
            statusCode: (error as ResponseError).statusCode || 500,
            error: (error as ResponseError).message,
        };
    }
}

const getContentCached = async (fileName: string, locale: Locale, config) =>
    withCache<ApiResponseType>({
        key: `${fileName}-${locale}`,
        fn: getContent,
        TTL,
        useBackup: true,
    })(fileName, locale, config);

export default getContentCached;
export const getNavigationContent = getContentCached.bind(
    null,
    NAVIGATION_FILE_NAME || 'navigation',
);
