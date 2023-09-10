<script setup></script>
<template>
  <!--login page-->
  <div
    class="bg-background border-8 border-background-primary flex flex-1 flex-col items-center justify-center rounded-3xl p-10"
  >
    <h1 class="text-text-primary text-3xl font-black mb-8">Linux Odyssey</h1>
    <form action="" class="w-full">
      <div class="mb-6">
        <label for="email" class="text-sm font-semibold text-text">Email</label
        ><input
          type="email"
          id="email"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your email address"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="text-sm font-semibold leading-6 text-text"
          >Password</label
        ><input
          type="password"
          id="password"
          class="my-4 bg-background-primary text-text-primary bg- rounded-md block w-full px-3 h-10 shadow-sm focus:outline-none placeholder:text-text-line focus:ring-2 focus:ring-text-primary ring-1 ring-background-secondary"
          placeholder="Enter your password"
        />
      </div>
      <router-link
        type="submit"
        class="inline-flex justify-center rounded-lg text-sm font-black py-2 mt-3 bg-text-primary text-background w-full"
        to="/game"
      >
        <span>Log in / Sign up</span>
      </router-link>
      <input type="hidden" name="remember" value="true" />
    </form>
  </div>
</template>
