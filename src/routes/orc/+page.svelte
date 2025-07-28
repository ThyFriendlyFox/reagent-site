<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
let fadeIn = false;

function handleBack() {
  goto('/agent');
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
      <div class="medium-font mb-12" tabindex="0" on:click={handleBack} on:keydown={(e) => e.key === 'Enter' && handleBack()} aria-label="Back to Agent">ORC</div>
      <div class="text-lg leading-relaxed w-full text-justify break-words mb-16">
        ORC is an agent from <a href="https://github.com/reagent-systems/orc" style="color:inherit; text-decoration:underline;">reagent-systems/orc</a>.<br/><br/>
        <b>ORC</b> is a flexible, open-source agent designed for orchestrating and automating complex workflows. It is built to be extensible, allowing integration with a wide range of tools and APIs. ORC can be used to coordinate tasks, manage dependencies, and streamline processes in research, engineering, and beyond. Its modular architecture makes it easy to adapt to new domains and requirements, empowering users to automate repetitive work and focus on higher-level problem solving.
      </div>
    </div>
    <div class="w-full md:w-1/2 pr-4 md:pr-8" />
  </div>
  <div class="w-full flex justify-center pb-12 fade-in" class:visible={fadeIn}>
    <a href="https://github.com/reagent-systems/orc" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">
      https://github.com/reagent-systems/orc
    </a>
  </div>
</div> 