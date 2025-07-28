<script lang="ts">
import { onMount } from 'svelte';
let fadeIn = false;

onMount(() => {
  setTimeout(() => { fadeIn = true; }, 10);
});

function handleBack() {
  window.location.href = '/';
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
.bordered-box {
  border: 1px solid white;
  padding: 1rem;
  margin-bottom: 1rem;
}
.profile-container {
  display: flex;
  flex-direction: column;
  padding: 4rem;
  padding-top: 12rem;
  max-width: 1400px;
  margin: 0 auto;
}
.main-content {
  display: flex;
  flex: 1;
}
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  .left-column {
    flex: none;
    padding-right: 0;
    margin-bottom: 2rem;
  }
  .right-column {
    flex: none;
    padding-left: 0;
    padding-right: 0;
  }
  .image-placeholder {
    height: 200px;
    margin-top: 0;
    width: 100%;
  }
  .profile-container {
    padding: 1rem;
    padding-top: 6rem;
  }
  .footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  .footer .left-column,
  .footer .right-column {
    flex: none;
    padding: 0;
    margin: 0;
  }
  .footer .team-names {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .footer .team-name-container {
    text-align: left;
    min-width: auto;
  }
}
.left-column {
  flex: 2;
  padding-right: 2rem;
}
.right-column {
  flex: 1;
  padding-left: 2rem;
  padding-top: 0;
  display: flex;
  flex-direction: column;
}
.image-placeholder {
  border: 1px solid white;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  flex: 1;
}
.bio-text {
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: justify;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1rem;
}
.team-names {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 4rem;
}
.team-name-container {
  min-width: 180px;
  text-align: right;
  white-space: nowrap;
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
.image-placeholder {
  border: 1px solid white;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}
</style>

<div class="min-h-screen bg-custom text-white font-courier">
  <div class="profile-container fade-in" class:visible={fadeIn}>
    <div class="main-content">
      <!-- Left Column -->
      <div class="left-column">
        <div class="mb-8">
          <div class="medium-font" tabindex="0" on:click={handleBack} on:keydown={(e) => e.key === 'Enter' && handleBack()} aria-label="Back to Home">
            Kyle Steel
          </div>
        </div>
        
        <div class="mb-6">
          <div>Alias: ThyFriendlyFox</div>
          <div>Age: 27</div>
          <div>Location: Florida</div>
          <div>Title: CEO</div>
        </div>
        
        <div class="bio-text">
          I graduated from Florida Polytechnic University with a Masters of Engineering in 2022 with a thesis focused on using Fourier-based machine learning techniques to calculate nonlinear physics systems with greater precision and speed on an Arduino running a custom algorithm than the available university supercomputer running Ansys Mechanical. My passion has always been in Artificial Intelligence, and I even led the research and development team for AutoGPT for a short period of time, unlocking the possibility of truly multi-agent systems. Since graduating, I've been an ITAR and CMMC compliance system administrator. Most of my work has been developing a CMMC compliant ERP system for the manufacturing industry. I'm a self-taught software developer and system admin with experience running businesses for a number of years now.
        </div>
      </div>
      
      <!-- Right Column -->
      <div class="right-column">
        <div class="image-placeholder">
          Image/Slideshow
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <a href="https://www.github.com/thyfriendlyfox" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">https://www.github.com/thyfriendlyfox</a>
      <div class="team-names">
        <a href="/ethanshelton" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">Ethan Shelton</a>
        <a href="/bentlybro" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">BentlyBro</a>
        <a href="/coltonfrear" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">Colton Frear</a>
        <a href="/alexeykuznetsov" class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">Alexey Kuznetsov</a>
      </div>
    </div>
  </div>
</div> 