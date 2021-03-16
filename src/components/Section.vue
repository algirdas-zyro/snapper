<template>
  <main>
    <div class="controls">
      <div class="controls__field">
        <label for="width" class="controls__label">
          Grid width (step = column count)
        </label>
        <input
          v-model.number="width"
          type="range"
          min="1000"
          max="1600"
          :step="columnCount"
          name="width"
          id="width"
          class="controls__range"
        />
      </div>
      <div class="controls__field">
        <label for="columnCount" class="controls__label"> Column count </label>
        <input
          type="range"
          v-model.number="columnCount"
          min="4"
          max="16"
          name="columnCount"
          id="columnCount"
          class="controls__range"
        />
      </div>
      <div class="controls__field">
        <label for="columnGap" class="controls__label"> Column gap </label>
        <input
          type="range"
          v-model.number="columnGap"
          name="columnGap"
          id="columnGap"
          class="controls__range"
        />
      </div>
      <div class="controls__field">
        <label for="rowGap" class="controls__label"> Row gap </label>
        <input
          type="range"
          v-model.number="rowGap"
          name="rowGap"
          id="rowGap"
          class="controls__range"
        />
      </div>
    </div>
    <section class="section" ref="section" :style="sectionStyle">
      <Element
        v-for="(
          { width, top, left, id, content, shouldSnap }, index
        ) in elements"
        :width="width"
        :left="left"
        :top="top"
        :key="id"
        :shouldSnap="shouldSnap"
        :content="content"
        @element-click="() => handleElementClick(index)"
        @element-lock-click="() => handleElementLockClick(index)"
        @element-mouseleave="() => handleElementMouseleave(index)"
        @element-mouseenter="
          (payload) => handleElementMouseenter(payload, index)
        "
        @mousedown="(event) => handleMousedowno(event, index)"
      />
      <Tiles
        :row-count="rowCount"
        :column-count="columnCount"
        :show-tiles="showLeftGuide || showRightGuide"
        :show-left-guide="showLeftGuide"
        :show-right-guide="showRightGuide"
        :active-left-guide="activeLeftGuide"
        :active-right-guide="activeRightGuide"
        :active-top-guide="activeTopGuide"
      />
    </section>
  </main>
</template>

<script>
import Moveable from "moveable";

import Tiles from "./Tiles.vue";
import Element from "./Element.vue";

const INITIAL_SECTION_WIDTH = 1224;
const INITIAL_SECTION_HEIGHT = 248;
const INITIAL_COLUMN_GAP = 24;
const INITIAL_COLUMN_COUNT = 12;
const INITIAL_ROW_HEIGHT = 50;
const INITIAL_ROW_GAP = 12;
const INITIAL_ROW_COUNT = 3;

const INITAL_ELEMENTS = [
  {
    id: "id0",
    left: 0,
    top: 0,
    width: 184,
    content: "kontent id0 kontent id0 kontent id0 kontent id0 kontent id0",
    shouldSnap: true,
  },
  {
    id: "id1",
    left: 104,
    top: 0,
    width: 184,
    content: "kontent id1 kontent id1 kontent id1 kontent id1 kontent id1",
    shouldSnap: false,
  },
  {
    id: "id2",
    left: 208,
    top: 0,
    width: 184,
    content: "kontent id2 kontent id2 kontent id2 kontent id2 kontent id2",
    shouldSnap: true,
  },
];

const getClosest = (array, val) =>
  array.reduce((prev, curr) =>
    Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
  );

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
      moveable: null,

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
      e.target.style.top = `${e.top}px`;
      e.target.style.left = `${e.left}px`;
      this.elements[index].top = e.top;
      this.elements[index].left = e.left;
    },
    handleDragEnd(e, index) {
      //   if (this.isSnapEnabled) {
      if (this.elements[index].shouldSnap) {
        this.elements[index].left = this.activeLeftGuide;
        this.elements[index].width =
          this.activeRightGuide - this.activeLeftGuide;
        this.elements[index].top = this.activeTopGuide;
        e.target.style.left = `${this.elements[index].left}px`;
        e.target.style.width = `${this.elements[index].width}px`;
        e.target.style.top = `${this.elements[index].top}px`;
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
      //   if (this.isSnapEnabled) {
      if (this.elements[index].shouldSnap) {
        this.elements[index].left = this.activeLeftGuide;
        this.elements[index].width =
          this.activeRightGuide - this.activeLeftGuide;
        e.target.style.left = `${this.activeLeftGuide}px`;
        e.target.style.width = `${
          this.activeRightGuide - this.activeLeftGuideh
        }px`;
      }
      this.isResizingLeft = false;
      this.isResizingRight = false;
      this.activeElementIndex = -1;
    },
    initializeMoveable(elementRef, index) {
      this.moveable = new Moveable(document.body, {
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        container: this.sectionRef,
        target: elementRef,
        // passDragArea: true,
        draggable: true,
        // throttleDrag: 1,
        resizable: true,
        throttleResize: 1,
        edge: true,
        origin: false,
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
      if (this.activeElementIndex === -1) return;

      if (this.moveable) {
        this.moveable.destroy();
        this.moveable = null;
      }
      if (this.isSnapEnabled) {
        this.elements[index].left = this.activeLeftGuide;
        this.elements[index].width =
          this.activeRightGuide - this.activeLeftGuide;
      }
      this.isResizingLeft = false;
      this.isResizingRight = false;
      this.activeElementIndex = -1;
    },
    handleElementMouseenter(elementRef, index) {
      if (index === this.activeElementIndex) return;
      console.log("reinit");

      if (this.moveable) {
        this.moveable.destroy();
        this.moveable = null;
      }
      this.initializeMoveable(elementRef, index);
    },
    handleElementClick(index) {
      //   this.elements[index].shouldSnap = !this.elements[index].shouldSnap;
    },
    handleMousedown(e, index) {
      console.log(e, index);
    },
    handleElementLockClick(index) {
      this.elements[index].shouldSnap = !this.elements[index].shouldSnap;
    },
    reSnap() {
      this.elements.forEach((el, index) => {
        if (!this.elements[index].shouldSnap) return;

        this.elements[index].left = getClosest(this.leftTileGuides, el.left);
        this.elements[index].width = getClosest(this.rightTileGuides, el.width);
        this.elements[index].top = getClosest(this.topTileGuides, el.top);
      });
    },
  },
  computed: {
    sectionStyle: ({ width, height, rowGap, columnGap, columnCount }) => ({
      "--section-width": `${width}px`,
      "--section-height": `${height}px`,
      "--section-rowGap": `${rowGap}px`,
      "--section-columnGap": `${columnGap}px`,
      "--section-columnCount": columnCount,
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
    topTileGuides: ({ rowCount, rowGap, rowHeight }) => {
      return [...Array(rowCount)].map((column, i) => i * (rowHeight + rowGap));
    },
    bottomTileGuides: ({ topTileGuides, rowHeight }) => {
      return topTileGuides.map((edge) => edge + rowHeight);
    },
    activeLeftGuide: ({ leftTileGuides, elements, activeElementIndex }) => {
      if (activeElementIndex === -1) return;
      const { left } = elements[activeElementIndex];
      return getClosest(leftTileGuides, left);
    },
    activeRightGuide: ({ rightTileGuides, elements, activeElementIndex }) => {
      if (activeElementIndex === -1) return;

      const { left, width } = elements[activeElementIndex];
      const right = left + width;

      return getClosest(rightTileGuides, right);
    },
    activeTopGuide: ({ topTileGuides, elements, activeElementIndex }) => {
      if (activeElementIndex === -1) return;
      const { top } = elements[activeElementIndex];
      return getClosest(topTileGuides, top);
    },
    showLeftGuide: ({ isResizingLeft, elements, activeElementIndex }) => {
      return isResizingLeft && elements[activeElementIndex].shouldSnap;
    },
    showRightGuide: ({ isResizingRight, elements, activeElementIndex }) => {
      return isResizingRight && elements[activeElementIndex].shouldSnap;
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
  watch: {
    width: "reSnap",
    columnGap: "reSnap",
    columnWidth: "reSnap",
    rowGap: "reSnap",
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
  /* pointer-events: none; */
}

.moveable-control-box {
  pointer-events: all;
}

.section {
  position: relative;
  max-width: var(--section-width);
  margin: auto;
}

.moveable {
  /* position: absolute; */
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
  width: 2px;
  background-color: #357df9;
  /* opacity: 0; */
}

.moveable-control:not(.moveable-line):not(.s) {
  width: 8px;
  height: 8px;
  border-radius: 0;
  box-sizing: border-box;
  margin-top: -4px;
  margin-left: -4px;
  border: 2px solid #357df9;
  background-color: #ffff;
}
.moveable-line:not(.moveable-control):not(.s) {
  width: 2px;
  height: 2px;
  background-color: #357df9;
}
</style>
