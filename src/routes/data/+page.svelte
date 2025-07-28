<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
let fadeIn = false;
let sliding = false;
let moving = false;

onMount(() => {
  setTimeout(() => { fadeIn = true; }, 10);
});

async function handleBackNav(e: MouseEvent) {
  e.preventDefault();
  sliding = true;
  await new Promise(r => setTimeout(r, 500));
  goto('/');
}
</script>

<style>
.fade-in {
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1);
}
.fade-in.visible {
  opacity: 1;
}
.slide-up {
  transition: transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1);
  transform: translateY(-100vh);
  opacity: 0;
}
.bigword {
  transition: color 0.35s cubic-bezier(0.4,0,0.2,1), filter 0.35s cubic-bezier(0.4,0,0.2,1), text-shadow 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1);
  vertical-align: top;
  line-height: 1;
  backface-visibility: hidden;
  will-change: transform;
}
.bigword.moving {
  transform: translateY(-4px);
}
.underline-animate {
  position: relative;
}
.underline-animate::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -2px;
  width: 0%;
  height: 2px;
  background: currentColor;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1), left 0.3s cubic-bezier(0.4,0,0.2,1);
  transform: translateX(-50%);
}
.underline-animate:hover::after, .underline-animate:focus::after {
  width: 100%;
  left: 50%;
}
</style>

<div class="min-h-screen flex flex-col items-center justify-center bg-custom text-white">
  <div class="flex flex-col items-center fade-in flex-1 justify-center" class:visible={fadeIn} class:slide-up={sliding}>
    <a href="/" class="text-[6vw] font-normal font-helvetica bigword"
      on:mouseenter={() => moving = true}
      on:mouseleave={() => moving = false}
      class:moving={moving}
      on:click={handleBackNav}
      style="cursor:pointer;">
      Data
    </a>
    <a href="#" class="text-xl font-courier underline-animate" style="color:inherit; text-decoration:none; margin-top:48px;">Deku</a>
  </div>
</div> 