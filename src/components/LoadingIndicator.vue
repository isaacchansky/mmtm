<template>
  <div class="loading-container">
    <svg class="loader" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  </div>
</template>
<style>
.loading-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 15vw;
  height: 15vw;
  max-width: 80px;
  max-height: 80px;
}
.loader path {
  stroke: var(--color-gold);
}
.loader polyline {
  stroke: var(--color-green);
}

.loader polyline {
    opacity:1;
    animation: flickerAnimation 2s infinite;
}

@keyframes flickerAnimation { /* flame pulses */
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}
</style>
