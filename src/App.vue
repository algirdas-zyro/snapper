<template>
  <div class="page main">
    isResizingLeft: {{ isResizingLeft }} <br />
    isResizingRight: {{ isResizingRight }}
    <div class="grid" ref="grid" :style="gridStyle">
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
        <p>some relatively sized text</p>
      </Moveable>
      <div class="tiles" v-if="isResizingLeft || isResizingRight">
        <div class="tiles__row" v-for="row in rowCount" :key="`row${row}`">
          <div
            class="tiles__col"
            v-for="column in columnCount"
            :key="`column${column}`"
          />
        </div>
        <div
          v-if="isResizingLeft && isSnapEnabled"
          class="tiles__guide"
          :style="{ left: `${activeLeftGuide}px` }"
        />
        <div
          v-if="isResizingRight && isSnapEnabled"
          class="tiles__guide"
          :style="{ left: `${activeRightGuide}px` }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Moveable from "vue-moveable";

const INITIAL_GRID_WIDTH = 1224;
const INITIAL_GRID_HEIGHT = 80;
const INITIAL_COLUMN_GAP = 24;
const INITIAL_COLUMN_COUNT = 12;
const INITIAL_ROW_HEIGHT = 80;
const INITIAL_ROW_GAP = 24;
const INITIAL_ROW_COUNT = 3;

export default {
  name: "app",
  components: {
    Moveable,
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
        container: this.$refs.grid,
      },
      isSnapEnabled: true,
      gridWidth: INITIAL_GRID_WIDTH,
      gridHeight: INITIAL_GRID_HEIGHT,

      columnGap: INITIAL_COLUMN_GAP,
      columnCount: INITIAL_COLUMN_COUNT,
      rowHeight: INITIAL_ROW_HEIGHT,
      rowGap: INITIAL_ROW_GAP,
      rowCount: INITIAL_ROW_COUNT,

      // temporary point to hold left value
      componentLeftInitial: 0,
      componentLeft: 0,
      componentTop: 0,
      componentWidth: 200,

      isResizingLeft: false,
      isResizingRight: false,
    };
  },
  methods: {
    handleDragStart(e) {
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
      this.isResizingLeft = false;
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
    gridStyle({
      gridWidth,
      gridHeight,
      componentWidth,
      componentLeft,
      componentTop,
    }) {
      return {
        "--grid-width": `${gridWidth}px`,
        "--grid-height": `${gridHeight}px`,
        "--component-width": `${componentWidth}px`,
        "--component-left": `${componentLeft}px`,
        "--component-top": `${componentTop}px`,
      };
    },
    columnWidth: ({ gridWidth, columnCount, columnGap }) => {
      return (gridWidth + columnGap) / columnCount - columnGap;
    },
    leftTileGuides: ({ columnCount, columnGap, columnWidth }) => {
      return [...Array(columnCount)].map(
        (column, i) => i * (columnWidth + columnGap)
      );
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
    rightTileGuides: ({ leftTileGuides, columnWidth }) => {
      return leftTileGuides.map((edge) => edge + columnWidth);
    },
  },
  mounted() {
    // don't forget tho throttle this!
    const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
      this.gridWidth = contentRect.width;
      this.gridHeight = contentRect.height;
    });

    resizeObserver.observe(this.$refs.grid);
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

.grid {
  position: relative;
  /* max-width: var(--grid-width); */
  /* max-width: 1224px; */
  max-width: var(--grid-width);
  margin: auto;
}

.moveable {
  position: absolute;
  width: var(--component-width);
  left: var(--component-left);
  top: var(--component-top);
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
  grid-gap: 24px;
  grid-template-columns: repeat(12, 1fr);
  margin-bottom: 12px;
}

.tiles__col {
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