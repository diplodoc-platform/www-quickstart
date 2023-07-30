import type { Compiler } from 'webpack';
import { RuntimeGlobals, javascript } from 'webpack';
import { ConcatSource, RawSource } from 'webpack-sources';

const { JavascriptModulesPlugin } = javascript;
const { getChunkFilenameTemplate, getCompilationHooks } = JavascriptModulesPlugin;

function replaceRuntimeInit(compilation, { chunk, chunkGraph }, sources) {
    const entries = Array.from(
        chunkGraph.getChunkEntryModulesWithChunkGroupIterable(chunk)
    );

    if (entries.length === 0) {
        return sources;
    }

    const runtimeChunk = entries[0][1].getRuntimeChunk();
    const currentOutputName = compilation.getPath(
        getChunkFilenameTemplate(chunk, compilation.outputOptions),
        {
            chunk,
            contentHashType: 'javascript'
        }
    ).split('/');
    const runtimeOutputName = compilation.getPath(
        getChunkFilenameTemplate(
            runtimeChunk,
            compilation.outputOptions
        ),
        {
            chunk: /** @type {Chunk} */ (runtimeChunk),
            contentHashType: 'javascript'
        }
    ).split('/');

    // remove filename, we only need the directory
    currentOutputName.pop();

    // remove common parts
    while (
        currentOutputName.length > 0 &&
        runtimeOutputName.length > 0 &&
        currentOutputName[0] === runtimeOutputName[0]
        ) {
        currentOutputName.shift();
        runtimeOutputName.shift();
    }

    // create final path
    const runtimePath =
        (currentOutputName.length > 0
            ? '../'.repeat(currentOutputName.length)
            : './') + runtimeOutputName.join('/');

    const search = `var ${ RuntimeGlobals.require } = require(${ JSON.stringify(runtimePath) });`;
    const replace = `var ${ RuntimeGlobals.require } = require(${ JSON.stringify(runtimePath) })(state);`;

    return sources.getChildren().reduce((result, source) => {
        if (source instanceof RawSource) {
            if (source.source().includes(search)) {
                result.add(source.source().replace(search, replace));
            } else {
                result.add(source);
            }
        } else {
            result.add(source);
        }

        return result;
    }, new ConcatSource());
}

export class CustomRuntime {
    apply(compiler: Compiler) {
        compiler.hooks.thisCompilation.tap('CustomRuntime', (compilation) => {
            const hooks = getCompilationHooks(compilation);

            hooks.renderChunk.tap({
                name: 'CustomRuntime',
                stage: Infinity
            }, (sources, context) => {
                const { chunk } = context;

                if (chunk.chunkReason) {
                    return sources;
                }

                const source = new ConcatSource();

                source.add('module.exports = function(state) {');
                source.add('  const module = {};');
                source.add(replaceRuntimeInit(compilation, context, sources));
                source.add('; return module.exports;');
                source.add('};');

                return source;
            });

            hooks.renderMain.tap({
                name: 'CustomRuntime',
                stage: Infinity
            }, (sources) => {
                const source = new ConcatSource();

                source.add('module.exports = function(state) {');
                source.add('  const module = {};');
                source.add(sources);
                source.add('  module.exports.__STATE__ = state;');
                source.add('; return module.exports;');
                source.add('};');

                return source;
            })
        });
    }
}