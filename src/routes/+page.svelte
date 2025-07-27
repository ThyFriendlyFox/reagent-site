<script lang="ts">
  import { onMount } from 'svelte';
  import Tetrahedron from '$lib/Tetrahedron.svelte';

  let isLoading = true;
  let messages: Array<{type: 'user' | 'assistant', content: string}> = [];
  let inputValue = '';

  onMount(() => {
    // Show loading animation for 2 seconds
    setTimeout(() => {
      isLoading = false;
    }, 2000);
  });

  function handleSubmit() {
    if (inputValue.trim()) {
      messages = [...messages, { type: 'user', content: inputValue }];
      inputValue = '';
      // Simulate assistant response
      setTimeout(() => {
        messages = [...messages, { type: 'assistant', content: 'I understand your message. How can I help you today?' }];
      }, 1000);
    }
  }
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

<!-- Main Content -->
{#if !isLoading}
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-title">Quick Start</h3>
          <ul class="nav-list">
            <li><a href="#" class="nav-link">Clone Repository</a></li>
            <li><a href="#" class="nav-link">Install Dependencies</a></li>
            <li><a href="#" class="nav-link">Configure Environment</a></li>
            <li><a href="#" class="nav-link">Run Agent</a></li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">Installation</h3>
          <ul class="nav-list">
            <li><a href="#" class="nav-link">System Requirements</a></li>
            <li><a href="#" class="nav-link">Installation Methods</a></li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">Configuration</h3>
          <ul class="nav-list">
            <li><a href="#" class="nav-link">Environment Variables</a></li>
            <li><a href="#" class="nav-link">Example .env File</a></li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">API Reference</h3>
          <ul class="nav-list">
            <li><a href="#" class="nav-link">REST API Endpoints</a></li>
            <li><a href="#" class="nav-link">WebSocket Events</a></li>
          </ul>
        </div>
        
        <div class="nav-section">
          <h3 class="nav-title">Examples</h3>
          <ul class="nav-list">
            <li><a href="#" class="nav-link">Create a Python Script</a></li>
            <li><a href="#" class="nav-link">Web Research</a></li>
            <li><a href="#" class="nav-link">Data Analysis</a></li>
            <li><a href="#" class="nav-link">GitHub Operations</a></li>
          </ul>
        </div>
      </nav>
    </aside>

    <!-- Main Chat Area -->
    <main class="main-content">
      <div class="chat-container">
        <div class="messages-container">
          {#each messages as message}
            <div class="message {message.type}">
              <div class="message-content">
                {message.content}
              </div>
            </div>
          {/each}
        </div>
        
        <form class="input-container" on:submit|preventDefault={handleSubmit}>
          <input
            type="text"
            bind:value={inputValue}
            placeholder="Type your message..."
            class="message-input"
          />
          <button type="submit" class="send-button">
            Send
          </button>
        </form>
      </div>
    </main>
  </div>
{/if}

<style>
  .app-container {
    display: flex;
    height: 100vh;
    background-color: #0F0F0F;
  }

  .sidebar {
    width: 280px;
    background-color: #0F0F0F;
    border-right: 1px solid #333;
    padding: 2rem 0;
    overflow-y: auto;
  }

  .sidebar-nav {
    padding: 0 2rem;
  }

  .nav-section {
    margin-bottom: 2rem;
  }

  .nav-title {
    font-size: 1rem;
    font-weight: 300;
    color: #888;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-link {
    display: block;
    padding: 0.5rem 0;
    color: white;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 300;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: #ccc;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #0F0F0F;
  }

  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 2rem;
  }

  .message {
    margin-bottom: 1.5rem;
    display: flex;
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.assistant {
    justify-content: flex-start;
  }

  .message-content {
    max-width: 70%;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.5;
  }

  .message.user .message-content {
    background-color: #333;
    color: white;
  }

  .message.assistant .message-content {
    background-color: #1a1a1a;
    color: white;
    border: 1px solid #333;
  }

  .input-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .message-input {
    flex: 1;
    padding: 1rem 1.5rem;
    background-color: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: white;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    font-weight: 300;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .message-input:focus {
    border-color: #555;
  }

  .message-input::placeholder {
    color: #666;
  }

  .send-button {
    padding: 1rem 2rem;
    background-color: #333;
    border: 1px solid #555;
    border-radius: 8px;
    color: white;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    font-weight: 300;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .send-button:hover {
    background-color: #444;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .app-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #333;
      padding: 1rem 0;
    }
    
    .sidebar-nav {
      padding: 0 1rem;
    }
    
    .nav-section {
      margin-bottom: 1rem;
    }
    
    .chat-container {
      padding: 1rem;
    }
  }
</style>
