<template>
  <div
    class="element"
    ref="element"
    :style="elementStyle"
    @click="$emit('element-click', $refs.element)"
    @mouseenter="$emit('element-mouseenter', $refs.element)"
    @mouseleave="$emit('element-mouseleave')"
  >
    <p>
      {{ content }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Element",
  components: {
    // Moveable,
  },
  props: {
    id: String,
    content: String,
    width: Number,
    top: Number,
    left: Number,
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    elementStyle: ({ width, left, top }) => {
      return {
        //   "--section-width": `${width}px`,
        //   "--section-height": `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`,
      };
    },
    columnWidth: ({ width, columnCount, columnGap }) => {
      return (width + columnGap) / columnCount - columnGap;
    },
    leftTileGuides: ({ columnCount, columnGap, columnWidth }) => {
      return [...Array(columnCount)].map(
        (column, i) => i * (columnWidth + columnGap)
      );
    },
    rightTileGuides: ({ leftTileGuides, columnWidth }) => {
      return leftTileGuides.map((edge) => edge + columnWidth);
    },
    activeLeftGuide: ({ leftTileGuides, componentLeft }) => {
      return leftTileGuides.reduce((prev, curr) => {
        return Math.abs(curr - componentLeft) < Math.abs(prev - componentLeft)
          ? curr
          : prev;
      });
    },
    activeRightGuide: ({ rightTileGuides, componentLeft, componentWidth }) => {
      const right = componentLeft + componentWidth;
      return rightTileGuides.reduce((prev, curr) => {
        return Math.abs(curr - right) < Math.abs(prev - right) ? curr : prev;
      });
    },
    showLeftGuide: ({ isResizingLeft, isSnapEnabled }) => {
      return isResizingLeft && isSnapEnabled;
    },
    showRightGuide: ({ isResizingRight, isSnapEnabled }) => {
      return isResizingRight && isSnapEnabled;
    },
  },
  mounted() {},
};
</script>

<style>
html,
body {
  font-family: "Open Sans", sans-serif;
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;
  color: #333;
  letter-spacing: 1px;
  background: #f5f5f5;
  font-weight: 300;
}

.section {
  position: relative;
  max-width: var(--section-width);
  margin: auto;
}

.element {
  position: absolute;
  width: var(--element-width);
  left: var(--element-left);
  top: var(--element-top);
}

.element .image {
  width: 100%;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.tiles__row {
  display: grid;
  grid-gap: var(--section-columnGap);
  grid-template-columns: repeat(var(--section-columnCount), 1fr);
  margin-bottom: var(--section-rowGap);
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
  /* opacity: 0; */
}
</style>
