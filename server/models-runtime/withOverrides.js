import {CascadeMap} from './CascadeMap.js';

const Overrides = Symbol('Overrides');

const wrapCreate = (create, overrides) =>
    function (...args) {
        const ctx = create.call(this, ...args);

        if (!ctx[Overrides]) {
            ctx[Overrides] = overrides;
        } else {
            ctx[Overrides] = new CascadeMap(overrides, [...ctx[Overrides]]);
        }

        ctx.create = wrapCreate(ctx.create, ctx[Overrides]);
        ctx.request = wrapRequest(ctx.request, ctx[Overrides]);

        return ctx;
    };

const wrapRequest = (request, overrides) =>
    function (model, ...args) {
        const overriden = overrides.get(model);

        if (overriden) {
            this.log(`Use override ${model.displayName} -> ${overriden.displayName}`);
        }

        return request.call(this, overriden || model, ...args);
    };

export function withOverrides(pairs, model) {
    const action = model.action || model;

    const wrappedModel = async function (params, ctx, ...rest) {
        const overrides = new CascadeMap(ctx[Overrides], pairs);

        ctx[Overrides] = overrides;
        ctx.create = wrapCreate(ctx.create, overrides);
        ctx.request = wrapRequest(ctx.request, overrides);

        return action(params, ctx, ...rest);
    };

    Object.assign(wrappedModel, model);

    return wrappedModel;
}
