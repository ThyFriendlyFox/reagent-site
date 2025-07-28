<script lang="ts">
  export let data;
</script>

<style>
.font-courier {
  font-family: 'Courier New', Courier, monospace;
}
.medium-font {
  font-size: 2rem;
  cursor: default;
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
.scrollbox {
  max-height: 40vh;
  overflow-y: auto;
  background: transparent;
  border-radius: 0.5rem;
  padding: 1.5rem 0 1.5rem 0;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-left: 0;
}
@media (min-width: 768px) {
  .align-col {
    max-width: 600px;
    margin-left: 5vw;
    width: 100%;
    padding-left: 0;
  }
  .scrollbox {
    padding-left: 0;
  }
}
@media (max-width: 767px) {
  .align-col {
    width: 100vw;
    max-width: 100vw;
    margin-left: 0;
    padding-left: 6vw;
    box-sizing: border-box;
  }
  .scrollbox {
    padding-left: 0;
  }
}
</style>

<div class="min-h-screen flex flex-col bg-custom text-white font-courier">
  <div class="flex flex-col md:flex-row flex-1 items-center justify-center">
    <div class="flex flex-col justify-center w-full md:w-1/2 pr-8 md:pr-8 align-col">
      <div class="medium-font mb-12 font-courier" style="text-align:left;">{data.title}</div>
      <div class="scrollbox w-full mb-16">
        {data.content}
      </div>
    </div>
    <div class="w-full md:w-1/2 pr-4 md:pr-8" />
  </div>
  <div class="w-full flex justify-center pb-12">
    <a href={data.link} class="text-lg underline-animate font-courier" style="color:inherit; text-decoration:none;">
      {data.link}
    </a>
  </div>
</div> 