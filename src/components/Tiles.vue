<template>
  <div class="tiles">
    <div
      class="tiles__row"
      v-for="row in rowCount"
      :key="`row${row}`"
    >
      <div
        class="tiles__column"
        v-for="column in columnCount"
        :key="`column${column}`"
      />
    </div>
    <div
      v-if="showLeftGuide"
      class="tiles__guide"
      :style="{ left: `${activeLeftGuide}px` }"
    />
    <div
      v-if="showRightGuide"
      class="tiles__guide"
      :style="{ left: `${activeRightGuide}px` }"
    />
  </div>
</template>

<script>

export default {
  name: "Tiles",
  props: {
    rowCount: Number,
    columnCount: Number,
    showLeftGuide: Boolean,
    showRightGuide: Boolean,
    activeLeftGuide: Number,
    activeRightGuide: Number,
  },
};
</script>

<style>
.tiles__row {
  display: grid;
}

.tiles__column {
  height: 50px;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.35);
}

.tiles__guide {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #4af;
}
</style>