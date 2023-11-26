<script setup>
import FileNode from './FileNode.vue'
import sessionStore from '../store/session.js'
</script>

<template>
  <div class="tree w-max h-max">
    <ul>
      <li>
        <FileNode
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
  border-top: 1px solid #00ff00;
  width: 50%;
  height: 20px;
}
.tree li::after {
  right: auto;
  left: 50%;
  border-left: 1px solid #00ff00;
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
  border-right: 1px solid #00ff00;
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
  border-left: 1px solid #00ff00;
  width: 0;
  height: 20px;
}

.tree li a {
  border: 1px solid #00ff00;
  padding: 5px 10px;
  text-decoration: none;
  color: #ffffff;
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
  background: #526b4e;
  color: #000;
  border: 1px solid #94a0b4;
}

ul.discovered,
li.discovered {
  border-color: #94a0b4;
}

a.pwd {
  box-shadow: 0 0 40px rgba(255, 255, 0, 20);
}
</style>
