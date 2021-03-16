<template>
  <div
    class="element"
    ref="element"
    :style="elementStyle"
    @click="$emit('element-click', $refs.element)"
    @mouseenter="$emit('element-mouseenter', $refs.element)"
    @mouseleave="$emit('element-mouseleave')"
  >
    <FontAwesomeIcon
      class="element__lock"
      :icon="lockIcon"
      @click.stop="$emit('element-lock-click', $refs.element)"
    />
    <p>
      {{ content }}
    </p>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Element",
  components: {
    FontAwesomeIcon,
  },
  props: {
    id: String,
    content: String,
    width: Number,
    top: Number,
    left: Number,
    shouldSnap: Boolean,
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    lockIcon: ({ shouldSnap }) => (shouldSnap ? faLock : faLockOpen),
    elementStyle: ({ width, left, top }) => {
      return {
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`,
      };
    },
  },
  mounted() {},
};
</script>

<style>
.element {
  position: absolute;
}

.element__lock {
  position: absolute;
  bottom: 100%;
  left: 0;
  cursor: pointer;
}
</style>
