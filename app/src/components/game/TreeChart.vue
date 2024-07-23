<script setup lang="ts">
import FileNode from '../FileNode.vue'
import useSession from '../../store/session'

const sessionStore = useSession()
</script>

<template>
  <div class="tree w-max h-max">
    <ul>
      <li>
        <FileNode
          v-if="sessionStore.session"
          :node="sessionStore.session.graph"
          :pwd="sessionStore.session.pwd"
        />
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
  border-top: 2px solid #00ff00;
  width: 50%;
  height: 20px;
}
.tree li::after {
  right: auto;
  left: 50%;
  border-left: 2px solid #00ff00;
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
  border-right: 2px solid #00ff00;
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
  border-left: 2px solid #00ff00;
  width: 0;
  height: 20px;
}

.tree li a {
  border: 1px solid #00ff00;
  padding: 5px 10px;
  text-decoration: none;
  color: #ffffff;
  font-family: arial, verdana, tahoma;
  font-size: 12px;
  display: inline-block;

  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;

  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}

.tree li a.pwd {
  border: 3px solid #00ff00;
  background: #008080;
  font-weight: bold;
  font-size: 13px;
}
</style>
