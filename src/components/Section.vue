<template>
  <section class="section" ref="section" :style="sectionStyle">
    <!-- TODO: loop through elements -->
    <Element
      v-for="({ width, top, left, id, content }, index) in elements"
      :width="width"
      :left="left"
      :top="top"
      :key="id"
      :content="content"
      @element-mouseleave="() => handleElementMouseleave(index)"
      @element-mouseenter="(payload) => handleElementMouseenter(payload, index)"
    />
    <Tiles
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
import Moveable from "moveable";

import Tiles from "./Tiles.vue";
import Element from "./Element.vue";

const INITIAL_SECTION_WIDTH = 1224;
const INITIAL_SECTION_HEIGHT = 80;
const INITIAL_COLUMN_GAP = 24;
const INITIAL_COLUMN_COUNT = 12;
const INITIAL_ROW_HEIGHT = 80;
const INITIAL_ROW_GAP = 24;
const INITIAL_ROW_COUNT = 3;

const INITAL_ELEMENTS = [
  {
    id: "id0",
    left: 0,
    top: 0,
    width: 184,
    content: "kontent id0 kontent id0 kontent id0 kontent id0 kontent id0",
  },
  {
    id: "id1",
    left: 108,
    top: 0,
    width: 184,
    content: "kontent id1 kontent id1 kontent id1 kontent id1 kontent id1",
  },
  {
    id: "id2",
    left: 216,
    top: 0,
    width: 184,
    content: "kontent id2 kontent id2 kontent id2 kontent id2 kontent id2",
  },
];

export default {
  name: "Section",
  components: {
    Element,
    Tiles,
  },
  data() {
    return {
      elements: INITAL_ELEMENTS,
      activeElementIndex: -1,
      isSnapEnabled: true,
      moveable: null,
      isMoveableActive: false,

      width: INITIAL_SECTION_WIDTH,
      height: INITIAL_SECTION_HEIGHT,

      columnGap: INITIAL_COLUMN_GAP,
      columnCount: INITIAL_COLUMN_COUNT,
      rowHeight: INITIAL_ROW_HEIGHT,
      rowGap: INITIAL_ROW_GAP,
      rowCount: INITIAL_ROW_COUNT,

      // temporary point to hold left value

      isResizingLeft: false,
      isResizingRight: false,
    };
  },
  methods: {
    handleDragStart(e, index) {
      this.activeElementIndex = index;
      this.isResizingLeft = true;
      this.isResizingRight = true;
    },
    handleDrag(e, index) {
      this.elements[index].top = e.top;
      this.elements[index].left = e.left;
      e.target.style.top = `${e.top}px`;
      e.target.style.left = `${e.left}px`;
    },
    handleDragEnd(e, index) {
      if (this.isSnapEnabled) {
        this.elements[index].left = this.activeLeftGuide;
        this.elements[index].width =
          this.activeRightGuide - this.activeLeftGuide;
        e.target.style.left = `${this.elements[index].left}px`;
        e.target.style.width = `${this.elements[index].width}px`;
      }
      this.isResizingLeft = false;
      this.isResizingRight = false;
      this.activeElementIndex = -1;
    },
    handleResizeStart(e, index) {
      this.activeElementIndex = index;

      // make a clone of previous position to use for left positioning
      this.elements[index].initialLeft = this.elements[index].left;
      this.isResizingLeft = e.direction[0] === -1;
      this.isResizingRight = e.direction[0] === 1;
    },
    handleResize(e, index) {
      this.elements[index].width = e.target.clientWidth;
      e.target.style.width = `${e.width}px`;

      // only on left handle
      if (this.isResizingLeft) {
        this.elements[index].left =
          this.elements[index].initialLeft - e.dist[0];
        e.target.style.left = `${this.elements[index].left}px`;
      }
    },
    handleResizeEnd(e, index) {
      if (this.isSnapEnabled) {
        this.elements[index].left = this.activeLeftGuide;
        this.elements[index].width =
          this.activeRightGuide - this.activeLeftGuide;
        e.target.style.left = `${this.elements[index].left}px`;
        e.target.style.width = `${this.elements[index].width}px`;
      }
      this.isResizingLeft = false;
      this.isResizingRight = false;
      this.activeElementIndex = -1;
    },
    initializeMoveable(elementRef, index) {
      this.moveable = new Moveable(document.body, {
        target: elementRef,
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        container: this.sectionRef,
        passDragArea: true,
        draggable: true,
        // throttleDrag: 1,
        resizable: true,
        // throttleResize: 1,
        edges: true,
        renderDirections: ["e", "w"],
      });

      this.moveable
        .on("resizeStart", (e) => this.handleResizeStart(e, index))
        .on("resize", (e) => this.handleResize(e, index))
        .on("resizeEnd", (e) => this.handleResizeEnd(e, index))
        .on("dragStart", (e) => this.handleDragStart(e, index))
        .on("drag", (e) => this.handleDrag(e, index))
        .on("dragEnd", (e) => this.handleDragEnd(e, index));
    },
    handleElementMouseleave(index) {
      //   if (this.activeElementIndex === -1) return;
      //   if (this.moveable) {
      //     this.moveable.destroy();
      //     this.moveable = null;
      //   }
      //   if (this.isSnapEnabled) {
      //     this.elements[index].left = this.activeLeftGuide;
      //     this.elements[index].width =
      //       this.activeRightGuide - this.activeLeftGuide;
      //   }
      //   this.isResizingLeft = false;
      //   this.isResizingRight = false;
      //   this.activeElementIndex = -1;
    },
    handleElementMouseenter(elementRef, index) {
      if (this.moveable) {
        this.moveable.destroy();
        this.moveable = null;
      }
      this.initializeMoveable(elementRef, index);
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
    activeLeftGuide: ({ leftTileGuides, elements, activeElementIndex }) => {
      if (activeElementIndex === -1) return;
      return leftTileGuides.reduce((prev, curr) => {
        const { left } = elements[activeElementIndex];
        return Math.abs(curr - left) < Math.abs(prev - left) ? curr : prev;
      });
    },
    activeRightGuide: ({ rightTileGuides, elements, activeElementIndex }) => {
      if (activeElementIndex === -1) return;
      const { left, width } = elements[activeElementIndex];
      const right = left + width;
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
