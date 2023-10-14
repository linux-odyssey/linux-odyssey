<script setup>
import { ref } from 'vue'

const SURVEY_URL = 'https://www.surveycake.com/s/z67xG'

const showModal = ref(true) // Controls whether the modal is visible or not

const closeModal = () => {
  showModal.value = false
}

// Simulate completing a quest to show the modal
setTimeout(() => {
  showModal.value = true
}, 5000) // Show modal after 5 seconds
</script>

<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content bg-background-secondary rounded-lg">
      <span class="close text-text" @click="closeModal">&times;</span>
      <h2 class="text-2xl text-text mb-5 w-full inline-flex justify-center">
        Quest Completed!
      </h2>
      <p class="text-base text-text">
        您已成功完成挑戰，真的非常感謝您的參與！<br />
        如果您能撥冗填寫這份問卷，我們將不勝感激，這對我們非常重要！
      </p>
      <a
        :href="SURVEY_URL"
        target="_blank"
        class="inline-flex justify-center rounded-lg text-base font-black py-2 mt-3 bg-text-primary w-full"
        >填寫問卷</a
      >
    </div>
  </div>
</template>

<style>
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.modal-content {
  position: relative;
  margin: 15% auto;
  padding: 20px;
  width: 30%;
}

.close {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 30px;
  cursor: pointer;
}
</style>
