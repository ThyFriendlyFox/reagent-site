<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Tetrahedron from '$lib/Tetrahedron.svelte';

  let isLoading = true;

  onMount(() => {
    // Show loading animation for 2 seconds
    setTimeout(() => {
      isLoading = false;
    }, 2000);
  });

  function handleBack() {
    goto('/simple-agent');
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
  <div class="min-h-screen bg-custom text-white">
    <div class="docs-container">
      <div class="sidebar">
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
        <div class="docs-content">
          <div id="quick-start" class="docs-section">
            <h2>Quick Start Guide</h2>
            <p>Get reagent up and running in minutes with this step-by-step guide.</p>
            
            <div id="clone-repo" class="subsection">
              <h3>1. Clone Repository</h3>
              <div class="code-block">
git clone https://github.com/reagent-systems/reagent.git
cd reagent
              </div>
            </div>

            <div id="install-deps" class="subsection">
              <h3>2. Install Dependencies</h3>
              <div class="code-block">
pip install -r requirements.txt
              </div>
            </div>

            <div id="configure-env" class="subsection">
              <h3>3. Configure Environment</h3>
              <div class="code-block">
cp .env.example .env
# Edit .env with your API keys
              </div>
            </div>

            <div id="run-agent" class="subsection">
              <h3>4. Run Agent</h3>
              <div class="code-block">
python SimpleAgent.py -a 10 "Your task here"
              </div>
            </div>
          </div>

          <div id="installation" class="docs-section">
            <h2>Installation</h2>
            
            <div id="system-requirements" class="subsection">
              <h3>System Requirements</h3>
              <p><strong>Python 3.8+</strong> - Required for core functionality</p>
              <p><strong>4GB RAM</strong> - Minimum recommended memory</p>
              <p><strong>1GB Storage</strong> - For installation and workspace</p>
            </div>

            <div id="installation-methods" class="subsection">
              <h3>Installation Methods</h3>
              
              <h4>From Source (Recommended)</h4>
              <div class="code-block">
git clone https://github.com/reagent-systems/reagent.git
cd reagent
pip install -r requirements.txt
              </div>
              
              <h4>Docker</h4>
              <div class="code-block">
docker pull reagent/reagent:latest
docker run -it reagent/reagent
              </div>
            </div>
          </div>

          <div id="configuration" class="docs-section">
            <h2>Configuration</h2>
            
            <div id="environment-variables" class="subsection">
              <h3>Environment Variables</h3>
              
              <p><strong>OPENAI_API_KEY</strong> - Your OpenAI API key for GPT models (Required)</p>
              <p><strong>GEMINI_API_KEY</strong> - Google Gemini API key (Optional)</p>
              <p><strong>LM_STUDIO_URL</strong> - LM Studio server URL for local models (Optional)</p>
              <p><strong>GITHUB_TOKEN</strong> - GitHub personal access token (Optional)</p>
            </div>

            <div id="example-env" class="subsection">
              <h3>Example .env File</h3>
              <div class="code-block">
# AI Provider Configuration
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
LM_STUDIO_URL=http://localhost:1234

# GitHub Integration
GITHUB_TOKEN=your_github_token_here

# Agent Configuration
MAX_STEPS=15
AUTO_CONTINUE_STEPS=10
TOOLS_REPO_URL=https://github.com/reagent-systems/reagent-tools

# Web Interface
SECRET_KEY=your_secret_key_here
WEBSOCKET_URL=ws://localhost:8765
              </div>
            </div>
          </div>

          <div id="api-reference" class="docs-section">
            <h2>API Reference</h2>
            
            <div id="rest-endpoints" class="subsection">
              <h3>REST API Endpoints</h3>
              
              <div class="endpoint">
                <div class="method">GET</div>
                <div class="url">/api/status</div>
                <div class="description">Get system status and health information</div>
              </div>
              
              <div class="endpoint">
                <div class="method">POST</div>
                <div class="url">/api/agent/execute</div>
                <div class="description">Execute a command through the agent</div>
              </div>
              
              <div class="endpoint">
                <div class="method">GET</div>
                <div class="url">/api/files</div>
                <div class="description">List generated files</div>
              </div>
              
              <div class="endpoint">
                <div class="method">GET</div>
                <div class="url">/api/tools</div>
                <div class="description">Get available tools and commands</div>
              </div>
            </div>

            <div id="websocket-events" class="subsection">
              <h3>WebSocket Events</h3>
              
              <p><strong>agent_response</strong> - Receive agent responses and status updates</p>
              <p><strong>step_update</strong> - Real-time step execution updates</p>
              <p><strong>file_created</strong> - Notification when files are created</p>
              <p><strong>error</strong> - Error messages and exceptions</p>
            </div>
          </div>

          <div id="examples" class="docs-section">
            <h2>Examples</h2>
            
            <div id="python-script" class="subsection">
              <h3>Create a Python Script</h3>
              <div class="code-block">
python SimpleAgent.py -a 5 "Create a Python script that calculates the Fibonacci sequence up to n=20 and saves it to fibonacci.py"
              </div>
            </div>

            <div id="web-research" class="subsection">
              <h3>Web Research</h3>
              <div class="code-block">
python SimpleAgent.py -a 10 "Research the latest developments in AI and create a summary report"
              </div>
            </div>

            <div id="data-analysis" class="subsection">
              <h3>Data Analysis</h3>
              <div class="code-block">
python SimpleAgent.py -a 15 "Analyze the CSV file data.csv and create visualizations showing trends"
              </div>
            </div>

            <div id="github-operations" class="subsection">
              <h3>GitHub Operations</h3>
              <div class="code-block">
python SimpleAgent.py -a 8 "Clone the repository user/repo and analyze its structure"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

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
  }
  .docs-content {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.1rem;
    line-height: 1.8;
    text-align: justify;
    margin-top: 2rem;
  }
  .docs-section {
    margin-bottom: 3rem;
    scroll-margin-top: 2rem;
  }
  .docs-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #fff;
  }
  .subsection {
    margin-bottom: 2rem;
    padding-left: 1rem;
    border-left: 2px solid #333;
  }
  .subsection h3 {
    font-size: 1.3rem;
    margin-bottom: 0.75rem;
    color: #fff;
  }
  .subsection h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #fff;
  }
  .code-block {
    background: #1a1a1a;
    border: 1px solid #333;
    padding: 1rem;
    margin: 1rem 0;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
    overflow-x: auto;
  }
  .endpoint {
    background: #1a1a1a;
    border: 1px solid #333;
    padding: 0.5rem;
    margin: 0.5rem 0;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
  }
  .endpoint .method {
    color: #00ff00;
    font-weight: bold;
  }
  .endpoint .url {
    color: #fff;
  }
  .endpoint .description {
    color: #ccc;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  @media (max-width: 1024px) {
    .docs-container {
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1rem;
    }
    .sidebar {
      width: 100%;
      position: static;
    }
    .sidebar-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .sidebar-nav ul {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .sidebar-nav li {
      margin-bottom: 0;
    }
    .sidebar-nav a {
      border-left: none;
      border-bottom: 2px solid transparent;
      padding-left: 0;
      padding-bottom: 0.25rem;
    }
    .sidebar-nav a:hover,
    .sidebar-nav a.active {
      border-left-color: transparent;
      border-bottom-color: #fff;
    }
    .sidebar-nav .subsection-link {
      padding-left: 0;
      padding-bottom: 0.15rem;
    }
  }
  @media (max-width: 768px) {
    .docs-content {
      font-size: 1rem;
      line-height: 1.6;
    }
    .sidebar-nav {
      flex-direction: column;
    }
    .sidebar-nav ul {
      flex-direction: column;
    }
  }
</style>
