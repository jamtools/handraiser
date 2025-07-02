<script lang="ts">
    export let position: number;
    export let onPositionChange: (value: number) => void;
</script>

<div class="hand-slider-container">
    <div
        class="hand"
        style="position: absolute; bottom: calc({position / 127 * (100 - 40) + 20}vh);"
    >
        <img
            src="https://static.vecteezy.com/system/resources/previews/046/829/646/original/raised-hand-isolated-on-transparent-background-free-png.png"
            alt="Hand"
        />
    </div>
    <div class="slider-container">
        <div class="slider">
            <input
                type="range"
                value={position}
                on:input={(e) => {
                    onPositionChange(parseInt(e.target.value))
                }}
                max={127}
            />
            <pre>{position}</pre>
        </div>
    </div>
</div>
