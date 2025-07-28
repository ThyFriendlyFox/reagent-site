<script lang="ts">
  import { onMount } from 'svelte';
  import Tetrahedron from '$lib/Tetrahedron.svelte';

  let isLoading = true;
  let startFinishAnimation = false;
  let contentVisible = false;
  let startLoadingFadeOut = false;
  let sidebarOpen = false;
  let messages: Array<{type: 'user' | 'assistant' | 'system', content: string, timestamp: Date}> = [];
  let inputValue = '';
  let websocket: WebSocket | null = null;
  let summaryWebsocket: WebSocket | null = null;
  let connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  let summaryContent = 'Chat summary will appear here as you converse...';
  let messagesContainer: HTMLElement | undefined;
  let connectionAttempts = 0;
  const MAX_CONNECTION_ATTEMPTS = 3;
  let isClearing = false;

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
        // Ensure scroll to bottom when chat appears
        requestAnimationFrame(() => {
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        });
      }, 1400);
    }, 2000);

    return () => {
      if (websocket) {
        websocket.close();
      }
      if (summaryWebsocket) {
        summaryWebsocket.close();
      }
    };
  });

  function initializeWebSocket() {
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      connectionStatus = 'error';
              addMessage('assistant', 'Failed to connect after 3 attempts. Using demo mode. Type "retry" to attempt connection again.');
      // Fallback to demo mode after max attempts
      setTimeout(() => {
        connectionStatus = 'connected';
        addMessage('assistant', 'Demo mode: I\'m a simulated agent for testing. Try sending me a message!');
      }, 1000);
      return;
    }

    try {
      connectionAttempts++;
      connectionStatus = 'connecting';
      
      if (connectionAttempts > 1) {
        addMessage('assistant', `Attempting to connect... (${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`);
      }
      
      websocket = new WebSocket(WS_URL);
      
      // Also connect to summary WebSocket
      const SUMMARY_WS_URL = WS_URL.replace('/ws', '/summary');
      summaryWebsocket = new WebSocket(SUMMARY_WS_URL);

      websocket.onopen = () => {
        connectionStatus = 'connected';
        connectionAttempts = 0; // Reset on successful connection
        addMessage('assistant', 'Connected to agent. How can I help you today?');
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
        if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
          connectionStatus = 'disconnected';
          addMessage('assistant', 'Connection lost. Attempting to reconnect...');
          setTimeout(initializeWebSocket, 3000);
        } else {
          connectionStatus = 'error';
          addMessage('assistant', 'Failed to reconnect after 3 attempts. Using demo mode. Type "retry" to attempt connection again.');
          setTimeout(() => {
            connectionStatus = 'connected';
            addMessage('assistant', 'Demo mode: I\'m a simulated agent for testing. Try sending me a message!');
          }, 1000);
        }
      };

      websocket.onerror = () => {
        connectionStatus = 'error';
        if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
          addMessage('assistant', 'Connection error. Please check your internet connection.');
        }
      };

      // Summary WebSocket handlers
      summaryWebsocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          summaryContent = data.summary || data.content || event.data;
        } catch (e) {
          summaryContent = event.data;
        }
      };

    } catch (error) {
      connectionStatus = 'error';
      if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
        addMessage('assistant', 'Failed to connect to agent. Retrying...');
        setTimeout(initializeWebSocket, 3000);
      } else {
        addMessage('assistant', 'Failed to connect after 3 attempts. Using demo mode. Type "retry" to attempt connection again.');
        setTimeout(() => {
          connectionStatus = 'connected';
          addMessage('assistant', 'Demo mode: I\'m a simulated agent for testing. Try sending me a message!');
        }, 1000);
      }
    }
  }

  function addMessage(type: 'user' | 'assistant', content: string) {
    messages = [...messages, { type, content, timestamp: new Date() }];
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    });
  }

  function retryConnection() {
    connectionAttempts = 0; // Reset attempts
    connectionStatus = 'disconnected';
    addMessage('assistant', 'Retrying connection...');
    setTimeout(initializeWebSocket, 1000);
  }



  function scrollToBottom() {
    if (messagesContainer) {
      // Force scroll to absolute bottom
      setTimeout(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 10);
    }
  }

  function handleSubmit() {
    if (inputValue.trim()) {
      const message = inputValue.trim();
      addMessage('user', message);
      
      if (websocket && websocket.readyState === WebSocket.OPEN && connectionStatus === 'connected') {
        // Send message to WebSocket
        websocket.send(JSON.stringify({ 
          type: 'message', 
          content: message,
          timestamp: new Date().toISOString()
        }));
      } else {
        // Check for retry command
        if (message.toLowerCase() === 'retry') {
          retryConnection();
        } else {
          // Demo mode response (works regardless of connection status)
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
      }
      
      // Clear input without triggering auto-resize
      isClearing = true;
      inputValue = '';
      
      // Reset height manually and clear flag
      setTimeout(() => {
        const textarea = document.querySelector('.message-input-field') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = '1.5em';
        }
        isClearing = false;
      }, 0);
    }
  }



  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function autoResize(event: Event) {
    // Skip auto-resize if we're programmatically clearing
    if (isClearing) return;
    
    const textarea = event.target as HTMLTextAreaElement;
    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Only expand if there's content, otherwise keep at minimum
    if (textarea.value.trim()) {
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '1.5em'; // Minimum height when empty
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
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
        <div class="sidebar-header">
          <h3 class="font-courier">Chat Summary</h3>
        </div>
        
        <div class="summary-content">
          <p class="summary-text">{summaryContent}</p>
        </div>
      </div>
      
      <div class="main-content">
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
          
          <!-- Input Footer - Fixed at bottom -->
          <div class="chat-input-footer">
            <div class="message user input-message">
              <form class="message-content input-form" on:submit|preventDefault={handleSubmit}>
                <textarea
                  bind:value={inputValue}
                  placeholder="Type your message to the agent..."
                  class="message-input-field"
                  rows="1"
                  on:input={autoResize}
                  on:keydown={handleKeydown}
                ></textarea>
                <button 
                  type="submit" 
                  class="send-button-inline"
                  disabled={!inputValue.trim()}
                >
                  →
                </button>
              </form>
            </div>
          </div>
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
    padding: 2rem;
    display: flex;
    gap: 4rem;
    height: 100vh;
    max-height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    background: #0F0F0F;
  }
  .sidebar {
    width: 250px;
    flex-shrink: 0;
    position: sticky;
    top: 2rem;
    height: fit-content;
    background: #0F0F0F;
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
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    background: #0F0F0F;
  }



  /* Chat Container */
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    background: #0F0F0F;
  }

  /* Chat Input Footer */
  .chat-input-footer {
    flex-shrink: 0;
    padding: 1rem 2rem 2rem;
    background: #0F0F0F;
    border-top: 1px solid #333;
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 0;
    background: #0F0F0F;
    /* Hide scrollbar */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  /* Ensure messages start from bottom when container not full */
  .messages-area::before {
    content: '';
    flex: 1;
    min-height: 0;
  }

  .messages-area::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  /* Messages */
  .message {
    display: flex;
    max-width: 80%;
  }

  .message.user {
    align-self: flex-end;
    max-width: 90%; /* Make user messages wider */
  }

  /* Input message in footer - full width */
  .chat-input-footer .message.user.input-message {
    max-width: 100% !important;
    width: 100%;
    margin: 0; /* Remove any margins in footer */
  }

  .message.assistant {
    align-self: flex-start;
  }

  .message.system {
    align-self: center;
    max-width: 60%;
  }

  .message-content {
    background: transparent;
    border: 1px solid #333;
    padding: 1rem;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    width: 100%;
    min-width: 0; /* Allow flex shrinking */
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .message.user .message-content {
    background: transparent;
    border-color: #555;
  }

  .message-text {
    color: white;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    max-width: 100%;
  }

  .message-time {
    font-size: 0.7rem;
    color: #666;
    margin-top: 0.5rem;
    text-align: right;
  }

  /* Input Area - Message Style */
  .input-form {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin: 0;
    padding: 1rem;
    width: 100%; /* Force full width */
  }

  /* Force input message content to be full width */
  .message.user.input-message .message-content {
    width: 100% !important;
  }

  .message-input-field {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    outline: none;
    resize: none;
    overflow: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
    min-height: 1.5em;
    height: 1.5em; /* Start at minimum height */
    width: 100% !important;
    line-height: 1.5;
  }

  .message-input-field:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .message-input-field::placeholder {
    color: #aaa;
  }

  .send-button-inline {
    background: transparent;
    border: none;
    color: white;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    transition: opacity 0.2s ease;
    align-self: flex-start;
    margin-top: 0.1rem; /* Slight adjustment to align with text */
  }

  .send-button-inline:hover:not(:disabled) {
    opacity: 0.7;
  }

  .send-button-inline:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Sidebar Summary Styling */
  .sidebar-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #333;
  }

  .sidebar-header h3 {
    font-size: 1.2rem;
    color: #fff;
    margin: 0;
    font-weight: 300;
  }

  .summary-content {
    padding: 2rem;
    height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .summary-text {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #ccc;
    margin: 0;
    white-space: pre-wrap;
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
       padding: 1rem;
       padding-top: 3rem; /* Account for hamburger button */
       height: 100vh;
       max-height: 100vh;
       box-sizing: border-box;
       overflow: hidden;
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
       padding: 0.5rem;
       padding-top: 3rem; /* Account for hamburger button */
     }
     .sidebar {
       width: 100%; /* Full width on very small screens */
       left: -100%; /* Hide completely off-screen */
     }
     .sidebar.sidebar-open {
       left: 0;
     }

     .messages-area {
       padding: 1rem;
     }
     .message {
       max-width: 90%;
     }
     .message.user {
       max-width: 95%; /* Even wider on mobile for user messages */
     }
     .chat-input-footer .message.user.input-message {
       max-width: 100% !important;
       width: 100%;
     }

     .chat-input-footer {
       padding: 0.75rem 1rem 1rem;
     }
     .message-content {
       padding: 0.75rem;
       font-size: 0.8rem;
     }
     .input-form {
       padding: 0.75rem;
     }
     .message-input-field {
       font-size: 0.8rem;
     }
     .send-button-inline {
       font-size: 1rem;
     }
   }
</style>
