import {buildApplication, platformBrowserBuildConfig, platformNodeBuildConfig, buildServer} from 'springboard-cli/src/build';

import sveltePlugin from '@springboardjs/plugin-svelte/plugin';
import {spawn} from 'child_process';
import fs from 'fs';

const watch = process.argv.includes('--watch');

setTimeout(async () => {
    await buildApplication(platformBrowserBuildConfig, {
        applicationEntrypoint: `${process.cwd()}/src/index.svelte`,
        nodeModulesParentFolder: process.cwd(),
        watch,
        plugins: [
            sveltePlugin.default(),
        ],
    });

    await buildApplication(platformNodeBuildConfig, {
        watch,
        applicationEntrypoint: `${process.cwd()}/src/index.svelte`,
        nodeModulesParentFolder: process.cwd(),
        plugins: [
            sveltePlugin.default(),
        ],
    });

    await buildServer({
        watch,
        plugins: [
            sveltePlugin.default(),
        ],
    });

    const file = 'dist/server/dist/local-server.cjs';
    const args = [
        ...(watch ? ['--watch', '--watch-preserve-output'] : []),
        file,
    ];

    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '', {flag: 'wx'});
    }

    spawn('node', args, {
        stdio: 'inherit',
        env: process.env,
    });
});
