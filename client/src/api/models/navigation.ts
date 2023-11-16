import yaml from 'js-yaml';
import fetchData, {Locale} from '../../utils/fetch-data';
import {navigationEndpoint} from '~/configs/server';

export async function Navigation({lang}) {
    try {
        const res = await fetchData('navigation', lang || Locale.Ru, {navigationEndpoint});

        return yaml.load(res.data)
    } catch (error) {
        throw error;
    }
}

Navigation.displayName = 'navigation';