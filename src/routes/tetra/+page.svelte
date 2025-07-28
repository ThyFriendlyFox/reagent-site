<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
let fadeIn = false;

function handleBack() {
  goto('/app');
}

onMount(() => {
  setTimeout(() => { fadeIn = true; }, 10);
});
</script>

<style>
.fade-in {
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1);
}
.fade-in.visible {
  opacity: 1;
}
.font-courier {
  font-family: 'Courier New', Courier, monospace;
}
.medium-font {
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.medium-font:hover, .medium-font:focus {
  transform: translateY(-6px);
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

<div class="min-h-screen flex flex-col bg-custom text-white font-courier">
  <div class="flex flex-col md:flex-row flex-1 items-center justify-center">
    <div class="flex flex-col justify-center fade-in w-full md:w-1/2 pr-8 md:pr-8" class:visible={fadeIn} style="max-width:600px; margin-left:5vw;">
      <div class="medium-font mb-12" tabindex="0" on:click={handleBack} on:keydown={(e) => e.key === 'Enter' && handleBack()} aria-label="Back to App">Tetra</div>
      <div class="text-lg leading-relaxed w-full text-justify break-words mb-16">
        Tetra was built on the belief of helping those in need. By having an agent control your phone, any app can be automated and accessibility is maintained. Now you can just talk to your phone and set any task up automatically. By keeping the app local, your credentials are kept safe, and your privacy remains intact. The user interface is simple, with options like voice control and teach mode to remove repetition from your routine.
      </div>
    </div>
    <div class="w-full md:w-1/2 pr-4 md:pr-8" />
  </div>
  <div class="w-full flex justify-center pb-12 fade-in" class:visible={fadeIn}>
    <a href="https://github.com/reagent-systems/tetra" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">
      https://github.com/reagent-systems/tetra
    </a>
  </div>
</div> 