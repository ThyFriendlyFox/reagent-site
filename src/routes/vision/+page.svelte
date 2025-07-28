<script lang="ts">
  function handleBack() {
    window.location.href = '/';
  }

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<style>
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
.vision-container {
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
.vision-content {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: justify;
  margin-top: 2rem;
}
.vision-section {
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;
}
.vision-section h2 {
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
@media (max-width: 1024px) {
  .vision-container {
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
  .vision-content {
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

<div class="min-h-screen bg-custom text-white">
  <div class="vision-container">
    <div class="sidebar">
      <div class="medium-font font-courier" tabindex="0" on:click={handleBack} on:keydown={(e) => e.key === 'Enter' && handleBack()} aria-label="Back to Home">Vision</div>
      
      <nav class="sidebar-nav">
        <h3>Contents</h3>
        <ul>
          <li>
            <a on:click={() => scrollToSection('data-proposal')}>Data Proposal</a>
            <ul>
              <li><a class="subsection-link" on:click={() => scrollToSection('technical-proposal')}>Technical Proposal</a></li>
              <li><a class="subsection-link" on:click={() => scrollToSection('research-development')}>Research & Development</a></li>
              <li><a class="subsection-link" on:click={() => scrollToSection('use-cases')}>Use Cases & Competitive Advantage</a></li>
              <li><a class="subsection-link" on:click={() => scrollToSection('team-background')}>Team Background</a></li>
            </ul>
          </li>
          <li><a on:click={() => scrollToSection('model-proposal')}>Model Proposal</a></li>
          <li><a on:click={() => scrollToSection('agent-proposal')}>Agent Proposal</a></li>
          <li><a on:click={() => scrollToSection('app-proposal')}>App Proposal</a></li>
        </ul>
      </nav>
    </div>
    
    <div class="main-content">
      <div class="vision-content">
        <div id="data-proposal" class="vision-section">
          <h2>Data Proposal</h2>
          
          <div id="technical-proposal" class="subsection">
            <h3>Technical Proposal</h3>
            <p>We propose a decentralized federated learning network to train a 1.58-bit FP4 quantized Hinton-proposed forward-forward based language model off of function calls. This will allow us to train language models far cheaper, faster and more privately than traditional methods. By leveraging Hinton's forward-forward algorithm, we can further parallelize the training of Large Language Models. It is the consensus that current transformer-based LLMs are insufficient to handle truly complex tasks without spending tens of billions of dollars on GPU data centers. We have modified the transformer model to use ternary weights and replaced backpropagation with two forward passes of positive and negative information generated by the model itself coinciding with the function-call based dataset generated by our application usage. With federated learning we can scale the training of new models to any application using our embedded code. We request funding to establish our compute network to research this novel model architecture. The network would allow customers to benefit from AI and AI Agents for a lower cost without sacrificing personal user privacy.</p>
            
            <p>Further R&D is needed to implement FP4 quantization for both weights and activations, minimizing precision loss via techniques like oscillation-reduced training in vision transformers, which stabilizes low-precision computations in forward and backward passes. This differs significantly from existing solutions like traditional transformer-based LLMs, which rely on backpropagation, high-bit precision (e.g., FP16/32), and massive centralized GPU clusters costing billions, leading to high energy consumption and privacy risks from data aggregation; our approach eliminates backpropagation entirely, uses ternary approximations (log2(3) ~1.58 bits) for extreme compression, and decentralizes training via federated protocols on edge devices, achieving 10-100x cost reductions, faster convergence through parallelism, and inherent privacy by keeping data local. It surpasses standard quantized LLMs (e.g., BitNet) by fusing forward-forward's plausibility with function call-specific datasets, enabling on-device model evolution without raw data sharing, as explored in federated LLM frameworks addressing communication bottlenecks via message quantization and streaming. This innovation could create a new market for embeddable, privacy-centric AI training in app ecosystems, adopted due to regulatory demands (e.g., GDPR), reduced barriers for SMEs lacking GPU infrastructure, and viral scaling through user devices, similar to how FL has been embraced in IoT for scalable intelligence while preserving data sovereignty. We intend for the usage of our decentralized compute network to create an efficient model for hardware modules which could be soldered to PCBs or connected via GPIO to allow any device to work with the AI without worrying about compatibility as the AI module would be able to figure out what it is connected to and control the device.</p>
          </div>

          <div id="research-development" class="subsection">
            <h3>Research & Development</h3>
            <p>The specific research and development required includes prototyping the modified transformer architecture with ternary weights and FP4 quantization to adapt forward-forward's dual passes for function call sequences, using PyTorch for quantization-aware training to benchmark efficiency; designing a federated learning framework with tools like Flower for embedding in apps to aggregate model updates securely; building preprocessing pipelines for curating anonymized function call datasets with differential privacy; and validating the prototype on tasks like function prediction, measuring accuracy, speed, energy, and privacy metrics to prove 10-100x improvements over centralized methods.</p>
            
            <p>This work is technically innovative by pioneering the fusion of forward-forward parallelism—enabling local, biologically inspired learning without gradients—with low-precision quantization in decentralized settings, overcoming transformer limitations in resource-constrained environments, as demonstrated in recent LLMs meet FL studies tailoring paradigms for unique LM characteristics. Challenges include slower convergence in forward-forward due to contrastive limitations on complex tasks, managed via hybrid fine-tuning with backpropagation in early stages and Bayesian hyperparameter optimization on simulated benchmarks; data heterogeneity in federated setups causing biased models from non-IID function calls, addressed through personalized techniques like FedProx and synthetic balancing in wireless FL for LLMs, with simulations on 100+ virtual nodes; communication overhead on edge devices, mitigated by top-k sparsification and FP4 compression reducing payload by 75%, tested via streaming in efficient FL for LLMs; privacy vulnerabilities like model inversion, countered with Gaussian noise differential privacy and secure aggregation, audited for compliance in real-world FL applications; and quantization-induced accuracy drops from outliers in transformers, handled by post-training refinement and SVD-based absorption of low-rank components in 4-bit setups. Funding supports compute purchases for distributed networks, including GPU/FPGA clusters and edge nodes like NVIDIA Jetsons, essential for realistic prototyping and validation, aligning with NSF SBIR AI examples emphasizing hardware for efficient model deployment.</p>
          </div>

          <div id="use-cases" class="subsection">
            <h3>Use Cases & Competitive Advantage</h3>
            <p>The potential use cases of the model architecture are for embedded scripts into any system ranging from microcontrollers to cloud-based applications, even beyond. By training the model for less, and by implementing it in one of our agents, we can collect data useful to the consumer who intends on creating applications and robotics hardware that could utilize this function-calling model. The closest competitors usually create model wrappers to form the basis of their AI Agents, but our AI Agents are designed to run on agentic LLM models like the one we propose to make. By making the model incredibly small and accurate, we can extend the reach by placing it in smaller and smaller devices.</p>
            
            <p>Mobile devices are the obvious target space, where competition remains low because of the limited compute available in mobile processors; this leaves competitors having to utilize cloud-based API calls to compute farms running the current state of LLMs. The competitive advantage of utilizing our model is that it will run faster, be private, and dedicated to function calls, where agents need speed and privacy to be effective. By being private, apps running our model no longer need to worry about authentication and credential handling for security purposes, because data from app usage is not sent directly to a central data training center. This means it's easier for adoption of our models, and the speed and accuracy of this small model will encourage use. Both people and companies want to use AI, but the restrictions of being cloud-based, price, privacy concerns, and speed all limit what can be done. Even then, AI is rapidly being adopted. The potential of a model without these restrictions is awesome.</p>
          </div>

          <div id="team-background" class="subsection">
            <h3>Team Background</h3>
            <p>The team began in the AutoGPT research and development lab in 2023. Composed of five members, Kyle Steel, BentlyBro, Colton Frear, Ethan Shelton, and Alexey Kuznetsov Jr., we have so far been able to accomplish development of three apps and three agents, as well as a framework for training LLM models on Apple Silicon hardware. We have learned to adapt and use AI Agents to automate the processes that work and frequently experiment on the business model. Kyle Steel and BentlyBro both developed the first multi-agent system and self-improving agent, respectively. Alexey Kuznetsov has developed ERP systems for SpaceX suppliers. Ethan Shelton has built personal AI assistants for consumers and businesses.</p>
            
            <p>The company has been formed, and the team is dedicated to remaining open source. Expertise is not a gap; the main gap is volume on the team to distribute the workload. So far, the startup has managed; the team has created a bulletin board system for development and refinement through experimentation, collaboration and communication. Once issues are identified, open discussion with material exploration occurs on the topic. We automatically track programming progress with background agents to keep development flow uninterrupted. When solutions to the issues are proposed, the team experiments with the solutions until an ideal outcome arrives. The problem-solving process and the solution is announced on all platforms as part of our marketing strategy. By automating this process, the team has been more effective at development. Our implementation time metric is twenty minutes after issue identification. We need to hire more developers to accomplish the project sooner and distribute the workload.</p>
          </div>
        </div>

        <div id="model-proposal" class="vision-section">
          <h2>Model Proposal</h2>
          <p>Our model proposal focuses on creating a novel architecture that combines the efficiency of quantized models with the power of federated learning. We envision a model that can be deployed across diverse hardware environments while maintaining high performance and privacy standards.</p>
          
          <p>The core innovation lies in our approach to model compression and distributed training. By leveraging FP4 quantization and ternary weights, we achieve significant reductions in model size while preserving essential functionality. This enables deployment on edge devices and embedded systems that were previously unable to support AI workloads.</p>
          
          <p>Key aspects of our model proposal include adaptive quantization techniques that dynamically adjust precision based on layer importance, federated training protocols that ensure data privacy while enabling collaborative learning, and hardware-specific optimizations that maximize performance across different computing environments.</p>
        </div>

        <div id="agent-proposal" class="vision-section">
          <h2>Agent Proposal</h2>
          <p>Our agent proposal centers on creating intelligent, autonomous systems that can operate effectively in decentralized environments. These agents will be designed to work with our quantized models while providing robust, privacy-preserving AI capabilities.</p>
          
          <p>The agent architecture emphasizes modularity and adaptability, allowing for easy integration into existing systems and workflows. Each agent will be capable of learning from its environment and improving its performance over time through federated learning mechanisms.</p>
          
          <p>We propose developing agents that can handle complex decision-making tasks, automate routine processes, and provide intelligent assistance across various domains. The agents will be designed with built-in privacy controls and will operate without requiring constant cloud connectivity, making them ideal for edge computing scenarios.</p>
        </div>

        <div id="app-proposal" class="vision-section">
          <h2>App Proposal</h2>
          <p>Our app proposal focuses on creating user-friendly applications that demonstrate the power of our decentralized AI technology. These applications will serve as both proof-of-concept implementations and practical tools for end users.</p>
          
          <p>We plan to develop applications that showcase the unique capabilities of our federated learning approach, including privacy-preserving data analysis tools, intelligent automation platforms, and collaborative learning systems. Each app will be designed with a focus on user experience while maintaining the technical innovations that set our platform apart.</p>
          
          <p>The app ecosystem will include both standalone applications and SDKs for developers who want to integrate our technology into their own projects. We'll provide comprehensive documentation and support to ensure successful adoption and implementation.</p>
        </div>
      </div>
    </div>
  </div>
</div> 