<script lang="ts">
  import { onMount } from 'svelte';
  import Tetrahedron from '$lib/Tetrahedron.svelte';

  let isLoading = true;

  onMount(() => {
    // Show loading animation for 2 seconds
    setTimeout(() => {
      isLoading = false;
    }, 2000);
  });
</script>

<!-- Loading Screen -->
{#if isLoading}
  <div class="loading-container">
    <Tetrahedron />
  </div>
{:else}
  <div class="loading-container hidden">
    <Tetrahedron />
  </div>
{/if}

<!-- Main Content - Empty for now -->
{#if !isLoading}
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="text-medium fade-in">
      <!-- Your content will go here -->
    </div>
  </div>
{/if}

<style>
  .big-words {
    gap: 0;
  }
  
  .bigword {
    font-size: clamp(8rem, 6vw, 12rem);
  }
  
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .space-x-16 > * + * {
    margin-left: 4rem;
  }
  
  .md\:space-y-0 {
    margin-top: 0;
  }
  
  .md\:space-x-16 > * + * {
    margin-left: 4rem;
  }
  
  .pb-24 {
    padding-bottom: 6rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .flex-1 {
    flex: 1 1 0%;
  }
  
  .hidden {
    display: none;
  }
  
  @media (min-width: 768px) {
    .md\:flex {
      display: flex;
    }
    
    .md\:hidden {
      display: none;
    }
  }
</style>
