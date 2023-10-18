import yaml from 'js-yaml';

import {navigationEndpoint} from '~/configs/server';

export async function Navigation() {
    try {
        const res = await fetch(`${navigationEndpoint}/ru/published/navigation.yaml`);
        if(res.ok){
            return yaml.load(await res.text())
        }
        throw new Error(res.statusText);
    } catch (error) {
        throw error;
    }
}

Navigation.displayName = 'navigation';