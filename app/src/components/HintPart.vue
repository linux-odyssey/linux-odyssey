<template>
  <div>
    <div v-if="hintData">
      <h3>Hints:</h3>
      <FileNode :node="sessionManager.hint.value" />
    </div>
  </div>
</template>

<script setup>
import { FileNode } from '@linux-odyssey/file-graph'
import sessionManager from '../utils/session'
</script>
