import {buildApplication, platformBrowserBuildConfig, platformNodeBuildConfig, buildServer } from 'springboard-cli/src/build';

import sveltePlugin from '@springboardjs/plugin-svelte/plugin';

const watch = process.argv.includes('--watch');

setTimeout(async () => {
    await buildApplication(platformBrowserBuildConfig, {
        applicationEntrypoint: `${process.cwd()}/src/index.svelte`,
        nodeModulesParentFolder: process.cwd(),
        watch,
        plugins: [
            sveltePlugin.default,
        ],
    });

    await buildApplication(platformNodeBuildConfig, {
        watch,
        applicationEntrypoint: `${process.cwd()}/src/index.svelte`,
        nodeModulesParentFolder: process.cwd(),
        plugins: [
            sveltePlugin.default,
        ],
    });

    await buildServer({
        watch,
        plugins: [
            sveltePlugin.default,
        ],
    });
});
