<template>
  <!-- <div class="tiles" :class="{ 'is-active': showTiles }"> -->
  <div class="tiles" :class="{ 'is-active': true }">
    <div class="tiles__row" v-for="row in Number(rowCount)" :key="`row${row}`">
      <div
        class="tiles__column"
        v-for="column in Number(columnCount)"
        :key="`column${column}`"
      />
    </div>
    <div
      class="tiles__guide"
      :class="{ 'is-active': showTiles }"
      :style="{ left: `${activeLeftGuide}px` }"
    />
    <div
      class="tiles__guide"
      :class="{ 'is-active': showTiles }"
      :style="{ left: `${activeRightGuide}px` }"
    />
    <div
      class="tiles__guide tiles__guide--horizontal"
      :class="{ 'is-active': showTiles }"
      :style="{ top: `${activeTopGuide}px` }"
    />
  </div>
</template>

<script>
export default {
  name: "Tiles",
  props: {
    rowCount: Number,
    columnCount: Number,
    showTiles: Boolean,
    showLeftGuide: Boolean,
    showRightGuide: Boolean,
    activeLeftGuide: Number,
    activeRightGuide: Number,
    activeTopGuide: Number,
  },
};
</script>

<style>
.tiles {
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

.tiles.is-active {
  opacity: 1;
}

.tiles__row {
  display: grid;
}

.tiles__column {
  height: 80px;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid 1px rgba(255, 255, 255, 0.35);
}

.tiles__guide {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #4af;
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

.tiles__guide--horizontal:not(.s) {
  bottom: auto;
  width: auto;
  right: 0;
  left: 0;
  height: 2px;
}
.tiles__guide.is-active {
  /* opacity: 1; */
  opacity: .6;
}
</style>
