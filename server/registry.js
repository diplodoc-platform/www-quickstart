import {env} from 'node:process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

export default (env.NODE_ENV === 'development' ? {
    get Actions() {
        delete require.cache['@diplodoc/cabinet/actions'];
        return require('@diplodoc/cabinet/actions');
    },

    get Models() {
        delete require.cache['@diplodoc/cabinet/models'];
        return require('@diplodoc/cabinet/models');
    },

    get Manifest() {
        delete require.cache['@diplodoc/cabinet/manifest'];
        return require('@diplodoc/cabinet/manifest');
    },

    get Cabinet() {
        delete require.cache['@diplodoc/cabinet'];
        return require('@diplodoc/cabinet');
    },
} : {
    Actions: require('@diplodoc/cabinet/actions'),
    Models: require('@diplodoc/cabinet/models'),
    Manifest: require('@diplodoc/cabinet/manifest'),
    Cabinet: require('@diplodoc/cabinet'),
});
