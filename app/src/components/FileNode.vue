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
  <a href="#" :class="nodeClass()">
    <font-awesome-icon
      v-if="node.type === 'directory'"
      :icon="['far', 'directory']"
      class="text-text-primary size-8"
    />
    <font-awesome-icon
      v-else
      :icon="['far', 'file']"
      class="text-text-primary size-8"
    />
    <br />
    {{ node.discovered ? node.name : '???' }}
    {{ node.name === '' && node.discovered ? '/' : '' }}
  </a>
  <ul :class="nodeClass()" v-if="node.children && node.children.length > 0">
    <li :class="nodeClass()" v-for="child in node.children" :key="child.path">
      <FileNode :node="child" :pwd="pwd" />
    </li>
  </ul>
</template>
