import {I18N} from '@gravity-ui/i18n';
import {configure as uikitConfigure, Lang as UIKitLang} from '@gravity-ui/uikit';

import * as en from './en';
import * as ru from './ru';
import * as env from '~/configs/env';

export enum Locale {
    En = 'en',
    Ru = 'ru',
}

export const i18n = new I18N();

Object.keys(en).forEach((key) =>
    i18n.registerKeyset(
        Locale.En,
        key,
        (en as Record<string, Record<string, string | string[]>>)[key],
    ),
);

Object.keys(ru).forEach((key) =>
    i18n.registerKeyset(
        Locale.Ru,
        key,
        (ru as Record<string, Record<string, string | string[]>>)[key],
    ),
);

/**
 * Func for configurate locale
 *
 * @param locale - code of localization
 */

export const configureLang = (locale: string = Locale.En) => {
    uikitConfigure({lang: locale as UIKitLang});
    i18n.setLang(env.lang || 'ru');
};

export default (keyset: string) => i18n.keyset(keyset);
