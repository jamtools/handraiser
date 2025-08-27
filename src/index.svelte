<script module lang='ts'>
    import './index.css';

    import springboard from 'springboard';

    import { getSelf } from './import_self';
    import { createSvelteReactElement } from '@springboardjs/plugin-svelte/src/svelte_mounting';

    import { ModuleAPI } from 'springboard/engine/module_api';

    import '@jamtools/core/modules/macro_module/macro_module';

    declare module 'springboard/module_registry/module_registry' {
        interface AllModules {
            Main: Awaited<ReturnType<typeof createResources>>;
        }
    }

    springboard.registerModule('Main', {}, async (app) => {
        app.getModule('macro').setLocalMode(true);

        const props = { app };
        app.registerRoute('/', {}, function () {
            const self = getSelf();
            return createSvelteReactElement(self, props);
        });

        return createResources(app);
    });

    const createResources = async (moduleAPI: ModuleAPI) => {
        const states = await moduleAPI.createStates({
            handPositions: [0, 0],
        });

        const actions = moduleAPI.createActions({
            changeHandPosition: async (args: {
                index: number;
                value: number;
            }) => {
                states.handPositions.setStateImmer((positions) => {
                    positions[args.index] = args.value;
                });
            },
        });

        const macros = await moduleAPI.getModule('macro').createMacros(moduleAPI, {
            slider1: {
                type: 'midi_control_change_input',
                config: {},
            },
            slider2: {
                type: 'midi_control_change_input',
                config: {},
            },
        });

        return {
            states,
            actions,
            macros,
        };
    };
</script>

<script lang='ts'>
    import { stateSupervisorToStore } from '@springboardjs/plugin-svelte/src/svelte_store_helpers';

    import HandSlider from './HandSlider.svelte';
    import ReactInSvelte from '@springboardjs/plugin-svelte/src/ReactInSvelte.svelte';

    let { app }: { app: ModuleAPI } = $props();

    const main = app.getModule('Main');

    const actions = main.actions;

    const slider1 = main.macros.slider1;
    const slider2 = main.macros.slider2;

    const handPositions = stateSupervisorToStore(main.states.handPositions);

    let dialog: HTMLDialogElement;

    function openConfig() {
        dialog.showModal();
    }
</script>

<button onclick={openConfig}>Config</button>

<dialog bind:this={dialog}>
    <ReactInSvelte component={slider1.components.edit} props={{}} />
    <button onclick={() => dialog.close()}>Close</button>
</dialog>

<div class='hand-raiser-main'>
    <div class='hand-raiser-center'>
        {#each $handPositions as position, index}
            <HandSlider
                position={position}
                onPositionChange={(value) => actions.changeHandPosition({ index, value })}
            />
        {/each}
    </div>
</div>
