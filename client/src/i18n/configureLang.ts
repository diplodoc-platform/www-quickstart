import {I18N} from '@gravity-ui/i18n';
import {configure as uikitConfigure, Lang as UIKitLang} from '@gravity-ui/uikit';
import {configure as pcConfigure, Lang as PCLang} from '@gravity-ui/page-constructor';

import * as en from './en';
import * as ru from './ru';

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
    pcConfigure({lang: locale as PCLang});
};

export default (keyset: string) => i18n.keyset(keyset);
