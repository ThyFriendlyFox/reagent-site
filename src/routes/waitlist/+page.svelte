<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { db } from '$lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

let fadeIn = false;
let sliding = false;
let moving = false;
let email = '';
let isSubmitting = false;
let submitMessage = '';
let submitSuccess = false;

onMount(() => {
  setTimeout(() => { fadeIn = true; }, 10);
});

async function handleBackNav(e: MouseEvent) {
  e.preventDefault();
  sliding = true;
  await new Promise(r => setTimeout(r, 500));
  goto('/');
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  
  if (!email || !email.includes('@')) {
    submitMessage = 'Please enter a valid email address';
    submitSuccess = false;
    return;
  }

  if (!db) {
    submitMessage = 'Firebase not initialized. Please refresh the page.';
    submitSuccess = false;
    return;
  }

  isSubmitting = true;
  submitMessage = '';

  try {
    await addDoc(collection(db, 'waitlist'), {
      email: email,
      timestamp: serverTimestamp()
    });
    
    submitMessage = 'Thank you! You\'ve been added to the waitlist.';
    submitSuccess = true;
    email = '';
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    submitMessage = 'Something went wrong. Please try again.';
    submitSuccess = false;
  } finally {
    isSubmitting = false;
  }
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
    <a href="/" class="font-normal font-courier bigword"
      on:mouseenter={() => moving = true}
      on:mouseleave={() => moving = false}
      class:moving={moving}
      on:click={handleBackNav}
      style="cursor:pointer; font-size: clamp(2rem, 6vw, 4rem);">
      Waitlist
    </a>
    <div class="flex flex-col items-center space-y-8" style="margin-top:48px;">
      <form class="flex flex-row items-center space-x-4" on:submit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          bind:value={email}
          disabled={isSubmitting}
          class="px-4 py-2 bg-transparent border border-white text-white placeholder-white/60 font-courier text-lg focus:outline-none focus:border-white/80 disabled:opacity-50"
          style="min-width: 250px;"
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          class="px-6 py-2 bg-white text-black font-courier text-lg hover:bg-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {#if submitMessage}
        <div class="text-center font-courier text-lg" class:text-green-400={submitSuccess} class:text-red-400={!submitSuccess}>
          {submitMessage}
        </div>
      {/if}
    </div>
  </div>
</div> 