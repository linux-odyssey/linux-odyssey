<template>
  <a href="#" :class="nodeClass()">{{ node.discovered ? node.name : '???' }}</a>
  <ul :class="nodeClass()" v-if="node.children && node.children.length > 0">
    <li :class="nodeClass()" v-for="child in node.children" :key="child.path">
      <FileNode :node="child" />
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
})

function nodeClass() {
  return props.node.discovered ? 'discovered' : ''
}
</script>
