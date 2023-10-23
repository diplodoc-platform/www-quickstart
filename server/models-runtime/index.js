import {sign, extractFields} from './utils.js';
import {withOverrides} from './withOverrides.js';

const Errors = Symbol('Errors');

const request = (registry, req, res) =>
    async function request(model, props) {
        if (!model.displayName) {
            throw new TypeError('Model should define static `displayName` property');
        }

        const {displayName, displayProps, displayResult, displayTags} = model;

        props = props || {};

        const key = `${displayName};${sign(props)}`;
        const promise = registry.get(key);

        if (promise) {
            return promise;
        }

        const action =
            typeof model.action === 'function'
                ? model.action
                : typeof model === 'function'
                ? model
                : null;

        if (typeof action === 'function') {
            const promise = this.call(
                'model ' + displayName,
                async (ctx) => {
                    if (ctx.showModelName) {
                        ctx.showModelName(displayName);
                    }

                    if (displayProps && ctx.showModelProps) {
                        ctx.showModelProps(extractFields(props, displayProps));
                    }

                    const result = await action(props, ctx, req, res);

                    if (displayResult && ctx.showModelResult) {
                        ctx.showModelResult(extractFields(result, displayResult));
                    }

                    return result;
                },
                {
                    tags: {
                        component: 'models',
                        ...displayTags,
                    },
                },
            );

            registry.set(key, promise);
            promise.catch(() => registry.delete(key));

            return promise;
        }

        throw new TypeError('Unexpected model type for ' + displayName);
    };

const fail = (registry) =>
    function(error) {
        this.endTime = Date.now();

        const errors = registry.get(Errors);

        if (!errors.has(error)) {
            errors.add(error);

            this.logError('MODEL_ERROR', error);
        }

        if (this.span) {
            this.span.finish();
        }
    };

const create = (registry, req, res, original) =>
    function (...args) {
        const ctx = original.call(this, ...args);

        ctx.request = request(registry, req, res);
        ctx.create = create(registry, req, res, ctx.create);
        ctx.fail = fail(registry);

        return ctx;
    };

function withModels(req, res) {
    const registry = new Map([
        [Errors, new Set()]
    ]);

    req.ctx.request = request(registry, req, res);
    req.ctx.create = create(registry, req, res, req.ctx.create);
    req.ctx.fail = fail(registry);
}

export { sign, withOverrides, withModels };

