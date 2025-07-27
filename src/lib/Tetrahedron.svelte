<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let tetrahedron: THREE.Mesh;
  let animationId: number;

  onMount(() => {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F0F0F);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create tetrahedron geometry
    const geometry = new THREE.TetrahedronGeometry(1.5, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    tetrahedron = new THREE.Mesh(geometry, material);
    scene.add(tetrahedron);

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotate the tetrahedron
      tetrahedron.rotation.x += 0.01;
      tetrahedron.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (container && renderer) {
        container.removeChild(renderer.domElement);
      }
    };
  });
</script>

<div bind:this={container} class="tetrahedron-container"></div>

<style>
  .tetrahedron-container {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style> 