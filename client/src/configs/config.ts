import { parse } from '~/utils';

let config: <T = Record<string, any>>(name: string) => T;

if (process.env.SERVER) {
    config = function(name) {
        // eslint-disable-next-line no-undef
        const json = __webpack_require__.__STATE__[name];

        if (!json) {
            throw new Error(`Config '${ name }' not defined!`);
        }

        return json;
    }
} else {
    const cache: Record<string, any> = {};

    config = function(name) {
        if (!cache[name]) {
            const script = document.querySelector(`script[data-transfer-id="config-${ name }"]`);

            if (!script) {
                throw new Error(`Config '${ name }' not defined!`);
            }

            cache[name] = parse(script.innerHTML);
        }

        return cache[name];
    }
}


export { config };