<template>
  <div class="page main">
    <!-- do multiple sections with different params later -->
    <Section />
  </div>
</template>

<script>
import Section from "./components/Section.vue";

export default {
  name: "app",
  components: {
    Section,
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
.page {
  padding: 30px;
}
</style>