<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { goto } from '$app/navigation';
import { io, Socket } from 'socket.io-client';

let fadeIn = false;
let socket: Socket | null = null;
let connected = false;
let messages: Array<{type: 'agent' | 'user', content: string, timestamp: Date}> = [];
let currentMessage = '';
let isAgentRunning = false;
let isWaitingForInput = false;
let connectionError = '';

function handleBack() {
  goto('/agent');
}

function connectWebSocket() {
  try {
    // Connect to the Simple-Agent WebSocket server
    socket = io('https://simple-agent-websocket-88216607026.us-central1.run.app');
    
    socket.on('connect', () => {
      connected = true;
      connectionError = '';
      console.log('Connected to Simple-Agent WebSocket');
    });
    
    socket.on('disconnect', () => {
      connected = false;
      console.log('Disconnected from Simple-Agent WebSocket');
    });
    
    socket.on('connected', (data: any) => {
      console.log('Session established:', data);
    });
    
    socket.on('agent_started', (data: any) => {
      isAgentRunning = true;
      addMessage('agent', '🤖 Agent started processing your request...');
    });
    
    socket.on('assistant_message', (data: any) => {
      addMessage('agent', data.message);
    });
    
    socket.on('tool_call', (data: any) => {
      addMessage('agent', `🔧 Using tool: ${data.tool_name}`);
    });
    
    socket.on('step_summary', (data: any) => {
      addMessage('agent', `📝 Step ${data.step_number}: ${data.summary}`);
    });
    
    socket.on('waiting_for_input', (data: any) => {
      isWaitingForInput = true;
      addMessage('agent', '⏳ Waiting for your input...');
    });
    
    socket.on('task_completed', (data: any) => {
      isAgentRunning = false;
      addMessage('agent', '✅ Task completed successfully!');
    });
    
    socket.on('agent_finished', (data: any) => {
      isAgentRunning = false;
      addMessage('agent', '🏁 Agent finished execution');
    });
    
    socket.on('agent_error', (data: any) => {
      isAgentRunning = false;
      addMessage('agent', `❌ Error: ${data.error}`);
    });
    
    socket.on('error', (data: any) => {
      connectionError = data.message;
      console.error('WebSocket error:', data);
    });
    
  } catch (error) {
    connectionError = 'Failed to connect to Simple-Agent server';
    console.error('Connection error:', error);
  }
}

function addMessage(type: 'agent' | 'user', content: string) {
  messages = [...messages, {
    type,
    content,
    timestamp: new Date()
  }];
  
  // Auto-scroll to bottom
  setTimeout(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 100);
}

function sendMessage() {
  if (!currentMessage.trim() || !socket || !connected) return;
  
  const message = currentMessage.trim();
  addMessage('user', message);
  
  if (isWaitingForInput) {
    // Send user input during agent execution
    socket.emit('user_input', { input: message });
    isWaitingForInput = false;
  } else {
    // Start new agent run
    socket.emit('run_agent', {
      instruction: message,
      max_steps: 10,
      auto_continue: 0
    });
  }
  
  currentMessage = '';
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connected = false;
  messages = [];
  isAgentRunning = false;
  isWaitingForInput = false;
}

onMount(() => {
  setTimeout(() => { fadeIn = true; }, 10);
  connectWebSocket();
});

onDestroy(() => {
  disconnect();
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

/* Chat interface styles */
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 1rem;
}

.message {
  padding: 1rem;
  border: 1px solid white;
  background: transparent;
  color: white;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  width: 60%;
  max-width: 400px;
}

.message.user {
  align-self: flex-end;
  margin-left: auto;
}

.message.agent {
  align-self: flex-start;
  margin-right: auto;
}

.chat-input {
  border: 1px solid white;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 60%;
  max-width: 400px;
  align-self: flex-end;
  margin-left: auto;
  margin-top: auto;
}

.input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  padding: 0;
  outline: none;
}

.input-field::placeholder {
  color: #666;
}

.send-button {
  background: transparent;
  color: white;
  border: 1px solid white;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background: white;
  color: black;
}

.send-button:disabled {
  border-color: #666;
  color: #666;
  cursor: not-allowed;
}





.error-message {
  background: #330000;
  border: 1px solid #ff0000;
  color: #ff6666;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
}
</style>

<div class="min-h-screen flex flex-col bg-custom text-white font-courier">
  <div class="flex flex-col md:flex-row flex-1 items-center justify-center">
    <div class="flex flex-col justify-center fade-in w-full md:w-1/2 pr-8 md:pr-8" class:visible={fadeIn} style="max-width:600px; margin-left:5vw;">
      <div class="medium-font mb-12" tabindex="0" on:click={handleBack} on:keydown={(e) => e.key === 'Enter' && handleBack()} aria-label="Back to Agent">Simple-Agent</div>
      <div class="text-lg leading-relaxed w-full text-justify break-words mb-16">
        SimpleAgent is designed with the belief that AI agents don't need to be complex to be useful. By focusing on a small set of core operations and using function calling for all interactions, SimpleAgent remains easy to understand, modify, and extend while providing advanced features like dynamic tool loading, loop detection, and intelligent execution management.
      </div>
      <div class="mb-8">
        <a href="/simple-agent/docs" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">
          📚 View Documentation
        </a>
      </div>
    </div>
    
    <!-- Chat Interface Container -->
    <div class="w-full md:w-1/2 pr-4 md:pr-8 fade-in flex flex-col" class:visible={fadeIn} style="height: 60vh; max-height: 500px;">
      {#if connectionError}
        <div class="error-message">
          {connectionError}
        </div>
      {/if}
      
      <div class="chat-container">
        {#each messages as message}
          <div class="message {message.type}">
            {message.content}
          </div>
        {/each}
        
        <div class="chat-input">
          <input
            bind:value={currentMessage}
            on:keypress={handleKeyPress}
            placeholder="Enter your task or response..."
            class="input-field"
            disabled={!connected || isAgentRunning && !isWaitingForInput}
          />
          <button
            on:click={sendMessage}
            disabled={!connected || !currentMessage.trim() || (isAgentRunning && !isWaitingForInput)}
            class="send-button"
          >
            {#if isWaitingForInput}
              Send
            {:else if isAgentRunning}
              Running...
            {:else}
              Enter
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full flex justify-center pb-12 fade-in" class:visible={fadeIn}>
    <a href="https://github.com/reagent-systems/Simple-Agent-Core" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">
      https://github.com/reagent-systems/Simple-Agent-Core
    </a>
    <!-- <a href="https://github.com/reagent-systems/Simple-Agent-Tools" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">
      https://github.com/reagent-systems/Simple-Agent-Tools
    </a> -->
  </div>
</div> 