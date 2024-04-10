<script setup lang="ts">
const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
    default: '',
  },
})

function nodeClass() {
  const classes = []
  if (props.node.discovered) classes.push('discovered')
  if (props.node.path === props.pwd) classes.push('pwd')
  return classes
}
</script>

<template>
  <a href="#" :class="nodeClass()">{{ node.discovered ? node.name : '???' }}</a>
  <ul :class="nodeClass()" v-if="node.children && node.children.length > 0">
    <li :class="nodeClass()" v-for="child in node.children" :key="child.path">
      <FileNode :node="child" :pwd="pwd" />
    </li>
  </ul>
</template>
