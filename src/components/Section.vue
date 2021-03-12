<template>
  <section class="section" ref="section" :style="sectionStyle">
    <!-- loop through elements -->
    <Moveable
      class="moveable"
      v-bind="moveable"
      @drag-start="handleDragStart"
      @drag="handleDrag"
      @drag-end="handleDragEnd"
      @resize-start="handleResizeStart"
      @resize="handleResize"
      @resize-end="handleResizeEnd"
    >
      component with relatively sized text
    </Moveable>
    <Tiles
      v-if="isResizingLeft || isResizingRight"
      :row-count="rowCount"
      :column-count="columnCount"
      :show-left-guide="showLeftGuide"
      :show-right-guide="showRightGuide"
      :active-left-guide="activeLeftGuide"
      :active-right-guide="activeRightGuide"
    />
  </section>
</template>

<script>
import Tiles from "./Tiles.vue";
import Moveable from "vue-moveable";

const INITIAL_SECTION_WIDTH = 1224;
const INITIAL_SECTION_HEIGHT = 80;
const INITIAL_COLUMN_GAP = 24;
const INITIAL_COLUMN_COUNT = 12;
const INITIAL_ROW_HEIGHT = 80;
const INITIAL_ROW_GAP = 24;
const INITIAL_ROW_COUNT = 3;

export default {
  name: "app",
  components: {
    Moveable,
    Tiles,
  },
  data() {
    return {
      moveable: {
        passDragArea: true,
        draggable: true,
        throttleDrag: 1,
        resizable: true,
        throttleResize: 1,
        edges: true,
        renderDirections: ["e", "w"],
        container: this.$refs.section,
      },
      isSnapEnabled: true,
      width: INITIAL_SECTION_WIDTH,
      height: INITIAL_SECTION_HEIGHT,

      columnGap: INITIAL_COLUMN_GAP,
      columnCount: INITIAL_COLUMN_COUNT,
      rowHeight: INITIAL_ROW_HEIGHT,
      rowGap: INITIAL_ROW_GAP,
      rowCount: INITIAL_ROW_COUNT,

      // temporary point to hold left value
      componentLeftInitial: 0,
      componentLeft: 0,
      componentTop: 0,
      componentWidth: 184,

      isResizingLeft: false,
      isResizingRight: false,
    };
  },
  methods: {
    handleDragStart() {
      this.isResizingLeft = true;
      this.isResizingRight = true;
    },
    handleDrag(e) {
      this.componentTop = e.top;
      this.componentLeft = e.left;
      e.target.style.top = `${e.top}px`;
      e.target.style.left = `${e.left}px`;
    },
    handleDragEnd(e) {
      if (this.isSnapEnabled) {
        this.componentLeft = this.activeLeftGuide;
        this.componentWidth = this.activeRightGuide - this.activeLeftGuide;
        e.target.style.left = `${this.componentLeft}px`;
        e.target.style.width = `${this.componentWidth}px`;
      }
      this.isResizingLeft = false;
      this.isResizingRight = false;
    },
    handleResizeStart(e) {
      this.componentLeftInitial = this.componentLeft;
      this.isResizingLeft = e.direction[0] === -1;
      this.isResizingRight = e.direction[0] === 1;
    },
    handleResize(e) {
      this.componentWidth = e.target.clientWidth;
      e.target.style.width = `${e.width}px`;

      // only on left handle
      if (this.isResizingLeft) {
        this.componentLeft = this.componentLeftInitial - e.dist[0];
        e.target.style.left = `${this.componentLeft}px`;
      }
    },
    handleResizeEnd(e) {
      if (this.isSnapEnabled) {
        this.componentLeft = this.activeLeftGuide;
        this.componentWidth = this.activeRightGuide - this.activeLeftGuide;
        e.target.style.left = `${this.componentLeft}px`;
        e.target.style.width = `${this.componentWidth}px`;
      }
      this.isResizingLeft = false;
      this.isResizingRight = false;
    },
  },
  computed: {
    sectionStyle: ({
      width,
      height,
      componentWidth,
      componentLeft,
      componentTop,
      rowGap,
      columnGap,
      columnCount,
    }) => ({
      "--section-width": `${width}px`,
      "--section-height": `${height}px`,
      "--section-rowGap": `${rowGap}px`,
      "--section-columnGap": `${columnGap}px`,
      "--section-columnCount": columnCount,
      "--element-width": `${componentWidth}px`,
      "--element-left": `${componentLeft}px`,
      "--element-top": `${componentTop}px`,
    }),
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
  mounted() {
    // don't forget tho throttle this!
    const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
      this.width = contentRect.width;
      this.height = contentRect.height;
    });

    resizeObserver.observe(this.$refs.section);
  },
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

.moveable {
  position: absolute;
  width: var(--element-width);
  left: var(--element-left);
  top: var(--element-top);
}

.moveable .image {
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