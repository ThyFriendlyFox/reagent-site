<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  export let startFinishAnimation: boolean = false;
  export let startLoadingFadeOut: boolean = false;

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let tetrahedron: THREE.Mesh;
  let tetraVertices: THREE.Vector3[] = [];
  let animationId: number;
  let animationPhase: 'rotating' | 'positioning' | 'fading-out' = 'rotating';
  
  // Animation state
  let finishStartTime: number = 0;
  let positioningDuration = 800; // ms to rotate to optimal position
  let fadeOutDuration = 600; // ms to fade out tetrahedron

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
    
    // Get the actual vertices of the tetrahedron
    const vertices = geometry.getAttribute('position').array;
    tetraVertices = [
      new THREE.Vector3(vertices[0], vertices[1], vertices[2]),   // Vertex 0
      new THREE.Vector3(vertices[3], vertices[4], vertices[5]),   // Vertex 1
      new THREE.Vector3(vertices[6], vertices[7], vertices[8]),   // Vertex 2
      new THREE.Vector3(vertices[9], vertices[10], vertices[11])  // Vertex 3
    ];
    
    // Find the vertex that should point downward (we'll use the first one)
    const targetVertex = tetraVertices[0];
    const downwardDirection = new THREE.Vector3(0, -1, 0);
    
    // Calculate rotation to align this vertex with downward direction
    const rotationQuaternion = new THREE.Quaternion().setFromUnitVectors(
      targetVertex.normalize(), 
      downwardDirection
    );
    
    // Apply the rotation
    tetrahedron.setRotationFromQuaternion(rotationQuaternion);
    
    scene.add(tetrahedron);

    // Simplified animation - just tetrahedron rotation and positioning

    // Animation loop
    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);
      
      if (startFinishAnimation && animationPhase === 'rotating') {
        // Start the finishing sequence
        finishStartTime = currentTime;
        animationPhase = 'positioning';
      }

      if (startLoadingFadeOut) {
        // Start the fade-out sequence
        finishStartTime = currentTime - positioningDuration;
        animationPhase = 'fading-out';
      }

      if (animationPhase === 'rotating') {
        // Normal rotation
        tetrahedron.rotation.x += 0.01;
        tetrahedron.rotation.y += 0.01;
      } else {
        // Handle finishing animation phases
        const elapsed = currentTime - finishStartTime;
        handleFinishAnimation(elapsed);
      }
      
      renderer.render(scene, camera);
    };

    animate(0);

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

  

  function handleFinishAnimation(elapsed: number) {
    if (animationPhase === 'positioning') {
      // Rotate tetrahedron to face-on position
      const progress = Math.min(elapsed / positioningDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
             // Find the vertex closest to the camera direction (toward screen)
       const cameraDirection = new THREE.Vector3(0, 0, -1); // Camera looks down negative Z
       
       // Get current vertex directions in world space
       let closestDot = -2;
       let closestVertexIndex = 0;
       let closestVertexDirection = tetraVertices[0];
       
       tetraVertices.forEach((vertex, index) => {
         const worldVertex = vertex.clone().applyEuler(
           new THREE.Euler(tetrahedron.rotation.x, tetrahedron.rotation.y, tetrahedron.rotation.z)
         );
         const dot = worldVertex.normalize().dot(cameraDirection);
         if (dot > closestDot) {
           closestDot = dot;
           closestVertexDirection = vertex;
           closestVertexIndex = index;
         }
       });
       
       // First, align closest vertex with camera direction
       const primaryRotation = new THREE.Quaternion().setFromUnitVectors(
         closestVertexDirection.normalize(), 
         cameraDirection
       );
       
       // Apply primary rotation to all vertices to see new orientations
       const rotatedVertices = tetraVertices.map(vertex => 
         vertex.clone().applyQuaternion(primaryRotation)
       );
       
       // Find the lowermost vertex of the face opposite to the camera-aligned vertex
       // (the 3 vertices that are NOT the camera-aligned vertex)
       let lowestY = Infinity;
       let lowestVertexDirection = rotatedVertices[0];
       
       rotatedVertices.forEach((vertex, index) => {
         if (index !== closestVertexIndex) { // Skip the vertex already aligned to camera
           if (vertex.y < lowestY) {
             lowestY = vertex.y;
             lowestVertexDirection = vertex;
           }
         }
       });
       
       // Project the lowest vertex onto the camera plane (remove Z component)
       const projectedVertex = new THREE.Vector3(lowestVertexDirection.x, lowestVertexDirection.y, 0).normalize();
       
       // Target: position this vertex at the bottom (negative Y direction)
       const bottomTarget = new THREE.Vector3(0, -1, 0);
       
       // Calculate rotation around camera axis (Z-axis) to align projected vertex with bottom
       const cameraAxisRotation = new THREE.Quaternion().setFromUnitVectors(
         projectedVertex,
         bottomTarget
       );
       
       // Combine both rotations: first align vertex to camera, then rotate around camera axis
       const finalRotation = new THREE.Quaternion().multiplyQuaternions(cameraAxisRotation, primaryRotation);
       const targetEuler = new THREE.Euler().setFromQuaternion(finalRotation);
       
       // Apply rotation with stronger easing for precise alignment
       const rotationSpeed = easeOut * 0.25; // Increased from 0.1 for faster convergence
       tetrahedron.rotation.x += (targetEuler.x - tetrahedron.rotation.x) * rotationSpeed;
       tetrahedron.rotation.y += (targetEuler.y - tetrahedron.rotation.y) * rotationSpeed;
       tetrahedron.rotation.z += (targetEuler.z - tetrahedron.rotation.z) * rotationSpeed;
      
            if (progress >= 1) {
        // Positioning complete - tetrahedron is perfectly aligned
        // Wait for fade-out signal from main component
      }
     } else if (animationPhase === 'fading-out') {
      // Fade out tetrahedron smoothly
      const progress = Math.min((elapsed - positioningDuration) / fadeOutDuration, 1);
      const fadeEase = progress * progress * (3 - 2 * progress); // Smoothstep
      
      // Fade out tetrahedron
      (tetrahedron.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - fadeEase);
      
      // Fade out the container itself
      if (container) {
        container.style.opacity = (1 - fadeEase).toString();
      }
    }
  }
</script>

<div bind:this={container} class="tetrahedron-container"></div>

<style>
  .tetrahedron-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    pointer-events: none;
  }
</style> 