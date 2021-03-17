<template>
  <div
    class="controls"
    :style="{
      maxWidth: `${width}px`,
    }"
  >
    <div class="controls__field">
      <label for="width" class="controls__label"> Grid width </label>
      <input
        :value="width"
        type="range"
        min="1000"
        max="1600"
        :step="columnCount"
        name="width"
        id="width"
        class="controls__range"
        @input="$emit('width-input', $event)"
      />
    </div>
    <div class="controls__field">
      <label for="columnCount" class="controls__label"> Column count </label>
      <input
        type="range"
        :value="columnCount"
        min="4"
        max="16"
        name="columnCount"
        id="columnCount"
        class="controls__range"
        @input="$emit('column-count-input', $event)"
      />
    </div>
    <div class="controls__field">
      <label for="columnGap" class="controls__label"> Column gap </label>
      <input
        type="range"
        :value="columnGap"
        name="columnGap"
        id="columnGap"
        class="controls__range"
        @input="$emit('column-gap-input', $event)"
      />
    </div>
    <div class="controls__field">
      <label for="rowGap" class="controls__label"> Row gap </label>
      <input
        type="range"
        :value="rowGap"
        name="rowGap"
        id="rowGap"
        class="controls__range"
        @input="$emit('row-gap-input', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Controls",
  props: {
    width: Number,
    columnCount: Number,
    columnGap: Number,
    rowGap: Number,
  },
  components: {},
  methods: {},
  computed: {},
  mounted() {},
  watch: {},
};
</script>

<style>
.controls {
  display: flex;
  margin: 24px auto;
}

.controls__field {
  flex: 0 1 100%;
  padding: 0 12px;
}
.controls__label {
  display: block;
  font-size: 14px;
}
.controls__range {
  display: block;
  width: 100%;
}
</style>
