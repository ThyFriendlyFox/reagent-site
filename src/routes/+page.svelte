<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Tetrahedron from '$lib/Tetrahedron.svelte';

  let isLoading = true;
  let startFinishAnimation = false;
  let contentVisible = false;
  let startLoadingFadeOut = false;
  let sidebarOpen = false;
  let messages: Array<{type: 'user' | 'assistant' | 'system', content: string, timestamp: Date}> = [];
  let inputValue = '';
  let websocket: WebSocket | null = null;
  let connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  let messagesContainer: HTMLElement | undefined;

  // WebSocket URL - replace with your actual Cloud Run function URL
  // Example: 'wss://reagent-agent-123abc-uc.a.run.app/ws'
  const WS_URL = 'wss://your-cloud-run-function-url.run.app/ws';

  onMount(() => {
    // Show loading animation for 2 seconds, then start finish sequence
    setTimeout(() => {
      startFinishAnimation = true;
      
      // Start fading out after positioning completes (0.8s after finish animation starts)
      setTimeout(() => {
        startLoadingFadeOut = true;
      }, 800);
      
      // Start fading in content slightly after fade begins (1.0s after finish animation starts)
      setTimeout(() => {
        contentVisible = true;
      }, 1000);
      
      // Wait for fade out to complete (1.4s after finish animation starts = 3.4s total)
      setTimeout(() => {
        isLoading = false;
        initializeWebSocket();
      }, 1400);
    }, 2000);

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  });

  function initializeWebSocket() {
    try {
      connectionStatus = 'connecting';
      websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        connectionStatus = 'connected';
        addSystemMessage('Connected to agent. How can I help you today?');
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addMessage('assistant', data.message || data.content || event.data);
        } catch (e) {
          addMessage('assistant', event.data);
        }
      };

      websocket.onclose = () => {
        connectionStatus = 'disconnected';
        addSystemMessage('Connection lost. Attempting to reconnect...');
        setTimeout(initializeWebSocket, 3000);
      };

      websocket.onerror = () => {
        connectionStatus = 'error';
        addSystemMessage('Connection error. Please check your internet connection.');
      };
    } catch (error) {
      connectionStatus = 'error';
      addSystemMessage('Failed to connect to agent. Using demo mode.');
      // Fallback to demo mode for development
      setTimeout(() => {
        connectionStatus = 'connected';
        addSystemMessage('Demo mode: I\'m a simulated agent for testing. Try sending me a message!');
      }, 1000);
    }
  }

  function addMessage(type: 'user' | 'assistant', content: string) {
    messages = [...messages, { type, content, timestamp: new Date() }];
    setTimeout(scrollToBottom, 100);
  }

  function addSystemMessage(content: string) {
    messages = [...messages, { type: 'system', content, timestamp: new Date() }];
    setTimeout(scrollToBottom, 100);
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function handleSubmit() {
    if (inputValue.trim() && connectionStatus === 'connected') {
      const message = inputValue.trim();
      addMessage('user', message);
      
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        // Send message to WebSocket
        websocket.send(JSON.stringify({ 
          type: 'message', 
          content: message,
          timestamp: new Date().toISOString()
        }));
      } else {
        // Demo mode response
        setTimeout(() => {
          const demoResponses = [
            "I understand your request. In a real implementation, I would process this through the cloud backend.",
            "This is a demo response. Your message would be sent to the Cloud Run function via WebSocket.",
            "Great question! The actual agent would analyze this and provide a detailed response.",
            "In the live version, I would execute tasks, search the web, or generate code based on your request.",
            "Demo mode: Your message has been received. The real agent would take action on this."
          ];
          const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
          addMessage('assistant', randomResponse);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      }
      
      inputValue = '';
    } else if (connectionStatus !== 'connected') {
      addSystemMessage('Not connected to agent. Please wait for connection to be established.');
    }
  }

  function handleBack() {
    goto('/simple-agent');
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 1024) {
      sidebarOpen = false;
    }
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<!-- Loading Screen -->
{#if isLoading}
  <div class="loading-container" class:loading-fade-out={startLoadingFadeOut}>
    <Tetrahedron {startFinishAnimation} {startLoadingFadeOut} />
  </div>
{/if}

<!-- Main Content -->
<div class="min-h-screen bg-custom text-white main-page-content" class:content-visible={contentVisible} class:content-hidden={!contentVisible}>
    <!-- Mobile Hamburger Button -->
    <button class="hamburger-btn" on:click={toggleSidebar} aria-label="Toggle navigation">
      <span class="hamburger-line" class:open={sidebarOpen}></span>
      <span class="hamburger-line" class:open={sidebarOpen}></span>
      <span class="hamburger-line" class:open={sidebarOpen}></span>
    </button>

    <!-- Mobile Overlay -->
    {#if sidebarOpen}
      <div class="mobile-overlay" on:click={toggleSidebar}></div>
    {/if}

    <div class="docs-container">
      <div class="sidebar" class:sidebar-open={sidebarOpen}>
        <div class="medium-font font-courier" tabindex="0" on:click={handleBack} on:keydown={(e) => e.key === 'Enter' && handleBack()} aria-label="Back to Simple-Agent">Documentation</div>
        
        <nav class="sidebar-nav">
          <h3>Contents</h3>
          <ul>
            <li>
              <a on:click={() => scrollToSection('quick-start')}>Quick Start Guide</a>
              <ul>
                <li><a class="subsection-link" on:click={() => scrollToSection('clone-repo')}>Clone Repository</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('install-deps')}>Install Dependencies</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('configure-env')}>Configure Environment</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('run-agent')}>Run Agent</a></li>
              </ul>
            </li>
            <li>
              <a on:click={() => scrollToSection('installation')}>Installation</a>
              <ul>
                <li><a class="subsection-link" on:click={() => scrollToSection('system-requirements')}>System Requirements</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('installation-methods')}>Installation Methods</a></li>
              </ul>
            </li>
            <li>
              <a on:click={() => scrollToSection('configuration')}>Configuration</a>
              <ul>
                <li><a class="subsection-link" on:click={() => scrollToSection('environment-variables')}>Environment Variables</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('example-env')}>Example .env File</a></li>
              </ul>
            </li>
            <li>
              <a on:click={() => scrollToSection('api-reference')}>API Reference</a>
              <ul>
                <li><a class="subsection-link" on:click={() => scrollToSection('rest-endpoints')}>REST API Endpoints</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('websocket-events')}>WebSocket Events</a></li>
              </ul>
            </li>
            <li>
              <a on:click={() => scrollToSection('examples')}>Examples</a>
              <ul>
                <li><a class="subsection-link" on:click={() => scrollToSection('python-script')}>Create a Python Script</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('web-research')}>Web Research</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('data-analysis')}>Data Analysis</a></li>
                <li><a class="subsection-link" on:click={() => scrollToSection('github-operations')}>GitHub Operations</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      
      <div class="main-content">
        <!-- Connection Status Bar -->
        <div class="status-bar">
          <div class="status-indicator" class:connected={connectionStatus === 'connected'} 
               class:connecting={connectionStatus === 'connecting'} 
               class:error={connectionStatus === 'error' || connectionStatus === 'disconnected'}>
          </div>
          <span class="status-text">
            {#if connectionStatus === 'connected'}
              Connected to Agent
            {:else if connectionStatus === 'connecting'}
              Connecting...
            {:else if connectionStatus === 'error'}
              Connection Error
            {:else}
              Disconnected
            {/if}
          </span>
        </div>

        <!-- Chat Container -->
        <div class="chat-container">
          <div class="messages-area" bind:this={messagesContainer}>
            {#each messages as message}
              <div class="message {message.type}">
                <div class="message-content">
                  <div class="message-text">{message.content}</div>
                  <div class="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Input Area -->
          <form class="input-container" on:submit|preventDefault={handleSubmit}>
            <input
              type="text"
              bind:value={inputValue}
              placeholder="Type your message to the agent..."
              class="message-input"
              disabled={connectionStatus !== 'connected'}
            />
            <button 
              type="submit" 
              class="send-button"
              disabled={!inputValue.trim() || connectionStatus !== 'connected'}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

<style>
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0F0F0F;
    z-index: 1000;
    transition: opacity 0.5s ease;
  }

  .loading-container.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .loading-container.loading-fade-out {
    transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
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
    left: 0;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background: currentColor;
    transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .underline-animate:hover::after, .underline-animate:focus::after {
    width: 100%;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .bg-custom {
    background-color: #0F0F0F;
  }
  .text-white {
    color: white;
  }

  /* Main content fade animation */
  .main-page-content {
    transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .content-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .content-visible {
    opacity: 1;
    pointer-events: auto;
  }
  .docs-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: flex;
    gap: 4rem;
  }
  .sidebar {
    width: 250px;
    flex-shrink: 0;
    position: sticky;
    top: 2rem;
    height: fit-content;
  }
  .sidebar-nav {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
  }
  .sidebar-nav h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #fff;
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
  }
  .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .sidebar-nav li {
    margin-bottom: 0.75rem;
  }
  .sidebar-nav a {
    color: #ccc;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s ease;
    display: block;
    padding: 0.5rem 0;
    border-left: 2px solid transparent;
    padding-left: 1rem;
  }
  .sidebar-nav a:hover {
    color: #fff;
    border-left-color: #fff;
  }
  .sidebar-nav a.active {
    color: #fff;
    border-left-color: #fff;
  }
  .sidebar-nav .subsection-link {
    padding-left: 2rem;
    font-size: 0.9rem;
    color: #999;
  }
  .sidebar-nav .subsection-link:hover {
    color: #ccc;
  }
  .main-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  /* Status Bar */
  .status-bar {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    background: #1a1a1a;
    border-bottom: 1px solid #333;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: #666;
  }

  .status-indicator.connected {
    background: #00ff00;
  }

  .status-indicator.connecting {
    background: #ffaa00;
    animation: pulse 1.5s infinite;
  }

  .status-indicator.error {
    background: #ff4444;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .status-text {
    color: #ccc;
  }

  /* Chat Container */
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Messages */
  .message {
    display: flex;
    max-width: 80%;
  }

  .message.user {
    align-self: flex-end;
  }

  .message.assistant {
    align-self: flex-start;
  }

  .message.system {
    align-self: center;
    max-width: 60%;
  }

  .message-content {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .message.user .message-content {
    background: #333;
    border-color: #555;
  }

  .message.system .message-content {
    background: #2a1a1a;
    border-color: #444;
    text-align: center;
    font-style: italic;
    color: #aaa;
  }

  .message-text {
    color: white;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .message-time {
    font-size: 0.7rem;
    color: #666;
    margin-top: 0.5rem;
    text-align: right;
  }

  .message.system .message-time {
    text-align: center;
  }

  /* Input Area */
  .input-container {
    display: flex;
    gap: 1rem;
    padding: 2rem;
    background: #0F0F0F;
    border-top: 1px solid #333;
  }

  .message-input {
    flex: 1;
    padding: 1rem 1.5rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .message-input:focus {
    border-color: #555;
  }

  .message-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .message-input::placeholder {
    color: #666;
  }

  .send-button {
    padding: 1rem 2rem;
    background: #333;
    border: 1px solid #555;
    border-radius: 8px;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .send-button:hover:not(:disabled) {
    background: #444;
    border-color: #666;
  }

  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Hamburger Menu Styles */
  .hamburger-btn {
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .hamburger-btn:hover {
    background: #333;
  }

  .hamburger-line {
    display: block;
    width: 20px;
    height: 2px;
    background: white;
    margin: 3px 0;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    transform-origin: center;
  }

  .hamburger-line.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger-line.open:nth-child(2) {
    opacity: 0;
  }

  .hamburger-line.open:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  /* Mobile Overlay */
  .mobile-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  @media (max-width: 1024px) {
    .hamburger-btn {
      display: block;
    }

    .mobile-overlay {
      display: block;
    }
    .docs-container {
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1rem;
      padding-top: 4rem; /* Account for hamburger button */
    }
    .sidebar {
      position: fixed;
      top: 0;
      left: -280px; /* Hide off-screen by default */
      width: 280px;
      height: 100vh;
      background: #0F0F0F;
      border-right: 1px solid #333;
      padding: 4rem 2rem 2rem 2rem; /* Extra top padding for hamburger */
      overflow-y: auto;
      transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
      z-index: 1000;
    }
    .sidebar.sidebar-open {
      left: 0; /* Slide in when open */
    }
          .sidebar-nav {
        display: block; /* Reset to block for vertical sidebar */
      }
      .sidebar-nav ul {
        display: block; /* Reset to block for vertical sidebar */
      }
      .sidebar-nav li {
        margin-bottom: 0.75rem; /* Restore original spacing */
      }
      .sidebar-nav a {
        border-left: 2px solid transparent; /* Restore left border */
        border-bottom: none;
        padding-left: 1rem; /* Restore left padding */
        padding-bottom: 0.5rem;
      }
      .sidebar-nav a:hover,
      .sidebar-nav a.active {
        border-left-color: #fff; /* Restore left border behavior */
        border-bottom-color: transparent;
      }
      .sidebar-nav .subsection-link {
        padding-left: 2rem; /* Restore subsection indentation */
        padding-bottom: 0.5rem;
      }
  }
     @media (max-width: 768px) {
     .docs-container {
       padding: 1rem;
       padding-top: 4rem; /* Account for hamburger button */
     }
     .sidebar {
       width: 100%; /* Full width on very small screens */
       left: -100%; /* Hide completely off-screen */
     }
     .sidebar.sidebar-open {
       left: 0;
     }
     .status-bar {
       padding: 0.75rem 1rem;
       font-size: 0.8rem;
     }
     .messages-area {
       padding: 1rem;
     }
     .input-container {
       padding: 1rem;
       gap: 0.5rem;
     }
     .message {
       max-width: 90%;
     }
     .message-content {
       padding: 0.75rem;
       font-size: 0.8rem;
     }
     .send-button {
       padding: 1rem 1.5rem;
       font-size: 0.8rem;
     }
   }
</style>
