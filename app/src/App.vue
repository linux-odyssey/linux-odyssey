<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('https://odyssey.wancat.cc/api/v1/quests/helloworld')
  .then((res) => res.json())
  .then((json) => {
    data.value = JSON.stringify(json.content)
  })
  .catch((err) => {
    error.value = err
  })
</script>

<template>
  <div class="bg-background-primary h-screen">
    <!--header-->
    <div id="header" class="bg-background-secondary content-center h-[5%] p-1">
      <div class="inline-block">
        <button id="stream">
          <font-awesome-icon
            :icon="['fas', 'bars-staggered']"
            class="text-text-primary"
          />
        </button>
        <button id="backward">
          <font-awesome-icon
            :icon="['fas', 'arrow-left']"
            class="text-border"
          />
        </button>
        <button>
          <p class="text-text-primary inline font-bold">1. Command's Basics</p>
        </button>
        <p class="text-text-primary inline font-bold">‧</p>
        <button>
          <p class="text-text-primary inline font-bold">
            1. Try Your First Command
          </p>
        </button>
      </div>
      <div class="float-right inline-block">
        <button id="warning">
          <font-awesome-icon
            :icon="['fas', 'triangle-exclamation']"
            class="text-text-primary"
          />
        </button>
        <button id="setting">
          <font-awesome-icon
            :icon="['fas', 'gear']"
            class="text-text-primary"
          />
        </button>
        <button id="fullscreen">
          <font-awesome-icon
            :icon="['fas', 'expand']"
            class="text-text-primary"
          />
        </button>
      </div>
    </div>
    <!--main-->
    <div id="main" class="h-[95%] grid grid-cols-3 gap-3 p-3">
      <!--Topic and Command List-->
      <div class="bg-background-secondary inline-block h-full rounded-lg">
        <section class="h-2/3 m-3">
          <h1 id="topic" class="text-text">Try Your First Command</h1>
          <hr class="border-text-line border-2 my-2" />
          <div>
            <p class="text-red-500" v-if="error">{{ error.message }}</p>
            <p class="text-text" v-else-if="data">{{ data }}</p>
            <p class="text-text" v-else>Loading...</p>
          </div>
        </section>
        <hr class="border-text-line border" />
        <section class="h-1/3">
          <font-awesome-icon
            :icon="['fas', 'list']"
            class="text-text-primary"
          />
          <h1 class="inline text-text-primary font-xl">Command Cheatsheets</h1>
          <div id="cheatsheets">
            <p class="text-text-secondary">No Available Command</p>
          </div>
        </section>
      </div>
      <!--Terminal and Hint-->
      <div class="bg-background inline-block h-full py-2 rounded-lg">
        <section id="terminal" class="h-3/5">
          <font-awesome-icon :icon="['fas', 'terminal']" class="text-text" />
          <button class="text-text h-[5%]">Terminal</button>
          <div class="bg-background-secondary h-[calc(100%-5%)] p-4">
            <p class="text-text-primary">
              zeko@first-command<span class="text-text">:~$</span>
            </p>
          </div>
        </section>
        <section class="h-2/5">
          <font-awesome-icon
            :icon="['far', 'lightbulb']"
            class="text-yellow-200"
          />
          <h1 class="inline text-text font-xl">Hint</h1>
          <div id="hint">
            <p class="text-text">Type command in the terminal above.</p>
          </div>
        </section>
      </div>
      <!--Visualization-->
      <div class="bg-background-primary inline-block h-full">
        <div class="bg-border rounded-xl h-[90%] px-3 py-6">
          <div class="bg-background rounded-xl h-full px-1 py-6">
            <section id="visualization" class="bg-background-primary h-full">
              <p class="text-text">visualization</p>
            </section>
          </div>
        </div>
        <section
          class="h-[10%] p-3 grid grid-cols-3 gap-4 place-content-between"
        >
          <button id="solution" class="bg-background-secondary rounded-lg p-2">
            <font-awesome-icon
              :icon="['far', 'circle-question']"
              class="text-text-primary"
            />
            <p class="text-text-primary inline">Solution</p>
          </button>
          <button id="reset" class="bg-background-secondary rounded-lg p-2">
            <font-awesome-icon
              :icon="['fas', 'arrow-rotate-left']"
              class="text-text-primary"
            />
            <p class="text-text-primary inline">Reset</p>
          </button>
          <button id="continue" class="bg-disabled-background rounded-lg p-2">
            <font-awesome-icon
              :icon="['far', 'circle-right']"
              class="text-disabled-text"
            />
            <p class="text-disabled-text inline">Continue</p>
          </button>
        </section>
      </div>
    </div>
  </div>
</template>
