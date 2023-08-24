<script setup>
import { onMounted, ref } from 'vue'
import FileNode from './FileNode.vue'
import socket from '../utils/socket.js'

const pwd = ref('/home/rudeus')

const graph = ref({
  path: '/',
  name: '/',
  type: 'folder',
  discovered: false,
  children: [
    {
      path: '/home',
      name: 'home',
      type: 'folder',
      discovered: false,
      children: [
        {
          path: '/home/rudeus',
          name: 'rudeus',
          type: 'folder',
          discovered: true,
          children: [
            {
              path: '/home/rudeus/secret',
              name: 'secret',
              type: 'file',
              discovered: true,
            },
            {
              path: '/home/rudeus/box',
              name: 'box',
              type: 'folder',
              discovered: true,
              children: [
                {
                  path: '/home/rudeus/box/scroll',
                  name: 'scroll',
                  type: 'file',
                  discovered: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/etc',
      name: 'etc',
      type: 'folder',
      discovered: false,
    },
  ],
})

onMounted(() => {
  socket.on('graph', (event) => {
    // TODO: update graph
    console.log(event)
  })
})
</script>

<template>
  <div class="tree w-max h-max">
    <ul>
      <li>
        <FileNode :node="graph" :pwd="pwd" />
      </li>
    </ul>
  </div>
</template>

<style>
.tree ul {
  padding-top: 20px;
  position: relative;

  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}

.tree li {
  display: inline-block;
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 20px 5px 0 5px;
  vertical-align: top;

  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}

.tree li::before,
.tree li::after {
  content: '';
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 1px solid #ccc;
  width: 50%;
  height: 20px;
}
.tree li::after {
  right: auto;
  left: 50%;
  border-left: 1px solid #ccc;
}

.tree li:only-child::after,
.tree li:only-child::before {
  display: none;
}

.tree li:only-child {
  padding-top: 0;
}

.tree li:first-child::before,
.tree li:last-child::after {
  border: 0 none;
}

.tree li:last-child::before {
  border-right: 1px solid #ccc;
  border-radius: 0 5px 0 0;
  -webkit-border-radius: 0 5px 0 0;
  -moz-border-radius: 0 5px 0 0;
}
.tree li:first-child::after {
  border-radius: 5px 0 0 0;
  -webkit-border-radius: 5px 0 0 0;
  -moz-border-radius: 5px 0 0 0;
}

.tree ul ul::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 1px solid #ccc;
  width: 0;
  height: 20px;
}

.tree li a {
  border: 1px solid #ccc;
  padding: 5px 10px;
  text-decoration: none;
  color: #666;
  font-family: arial, verdana, tahoma;
  font-size: 11px;
  display: inline-block;

  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;

  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}

a.discovered {
  background: #c8e4f8;
  color: #000;
  border: 1px solid #94a0b4;
}

ul.discovered,
li.discovered {
  border-color: #94a0b4;
}

a.pwd {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* 水平偏移、垂直偏移、模糊半徑、顏色 */
}
</style>
