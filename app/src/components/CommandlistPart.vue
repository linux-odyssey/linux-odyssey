<!--Translated-->
<template>
  <font-awesome-icon :icon="['fas', 'list']" class="text-text-primary p-1" />
  <h1 id="CommandBook" class="inline text-text-primary font-xl">
    <!-- Command Cheatsheets -->
    {{ $t('commandList.cheatsheet') }}
  </h1>
  <div id="cheatsheets">
    <p class="text-text-secondary">
      <!-- --Command List-- -->
      {{ $t('commandList.list') }}
    </p>
  </div>
</template>
