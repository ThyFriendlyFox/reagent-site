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
  let concentricTriangles: THREE.Mesh[] = [];
  let vertexIndicators: THREE.Group;
  let tetraVertices: THREE.Vector3[] = [];
  let animationId: number;
  let animationPhase: 'rotating' | 'positioning' | 'expanding' | 'revealing' | 'fading-out' = 'rotating';
  
  // Animation state
  let finishStartTime: number = 0;
  let positioningDuration = 600; // ms to rotate to downward-point position
  let expandingDuration = 600; // ms for triangles to appear
  let revealingDuration = 800; // ms for triangles to disappear layer by layer
  let fadeOutDuration = 900; // ms to fade out everything

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

    // Create custom vertex direction indicators
    const vertexLines = new THREE.Group();
    
    // Create lines from center to each vertex
    tetraVertices.forEach((vertex, index) => {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), // Center
        vertex.clone().multiplyScalar(2) // Extend line beyond vertex
      ]);
      
      // Color code the lines: red, green, blue, yellow
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
      const lineMaterial = new THREE.LineBasicMaterial({ color: colors[index] });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      vertexLines.add(line);
    });
    
    tetrahedron.add(vertexLines); // Attach to tetrahedron so it rotates with it
    vertexIndicators = vertexLines; // Store reference for fade-out

    // Create concentric triangles (initially hidden)
    createConcentricTriangles();

    // Animation loop
    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);
      
      if (startFinishAnimation && animationPhase === 'rotating') {
        // Start the finishing sequence
        finishStartTime = currentTime;
        animationPhase = 'positioning';
      }

      if (startLoadingFadeOut && animationPhase === 'revealing') {
        // Start the fade-out sequence
        finishStartTime = currentTime - positioningDuration - expandingDuration - revealingDuration;
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

  function createConcentricTriangles() {
    const triangleGeometry = new THREE.BufferGeometry();
    
    // Create a triangle
    const vertices = new Float32Array([
      0, 1, 0,      // top vertex
      -0.866, -0.5, 0,  // bottom left
      0.866, -0.5, 0    // bottom right
    ]);
    
    triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Create multiple concentric triangles with different sizes to fill the screen
    // Start from 3.5 to avoid misalignment with tetrahedron, add more for density
    const scales = [3.5, 5, 7, 10, 13.5, 17.5, 22, 27.5, 34, 42, 52, 64, 78, 95, 115, 138, 165, 196, 232, 275, 325, 385];
    
    scales.forEach((scale, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0
      });
      
      const triangle = new THREE.Mesh(triangleGeometry, material);
      triangle.scale.setScalar(scale); // Set to final size immediately
      triangle.rotation.z = Math.PI; // Rotate 180 degrees to point downward
      
      // Position triangles at final position (no movement during animation)
      triangle.position.z = 0; // Place at same plane as tetrahedron
      
              triangle.userData = { 
          originalScale: scale,
          index: index,
          targetOpacity: Math.max(0.08, 0.9 - index * 0.025) // Adjusted for 22 triangles
        };
      
      scene.add(triangle);
      concentricTriangles.push(triangle);
    });
  }

  function handleFinishAnimation(elapsed: number) {
    if (animationPhase === 'positioning') {
      // Rotate tetrahedron to face-on position
      const progress = Math.min(elapsed / positioningDuration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
             // Find the vertex closest to the camera direction (toward screen)
       const cameraDirection = new THREE.Vector3(0, 0, -1); // Camera looks down negative Z
       
       // Get current vertex directions in world space
       let closestDot = -2;
       let closestVertexDirection = tetraVertices[0];
       
       tetraVertices.forEach(vertex => {
         const worldVertex = vertex.clone().applyEuler(
           new THREE.Euler(tetrahedron.rotation.x, tetrahedron.rotation.y, tetrahedron.rotation.z)
         );
         const dot = worldVertex.normalize().dot(cameraDirection);
         if (dot > closestDot) {
           closestDot = dot;
           closestVertexDirection = vertex;
         }
       });
       
       // Calculate rotation to align closest vertex with camera direction
       const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
         closestVertexDirection.normalize(), 
         cameraDirection
       );
       const targetEuler = new THREE.Euler().setFromQuaternion(targetQuaternion);
       
       // Apply rotation with easing
       tetrahedron.rotation.x += (targetEuler.x - tetrahedron.rotation.x) * easeOut * 0.1;
       tetrahedron.rotation.y += (targetEuler.y - tetrahedron.rotation.y) * easeOut * 0.1;
       tetrahedron.rotation.z += (targetEuler.z - tetrahedron.rotation.z) * easeOut * 0.1;
      
      if (progress >= 1) {
        animationPhase = 'expanding';
        finishStartTime += positioningDuration;
      }
         } else if (animationPhase === 'expanding') {
       // Show concentric triangles in layers, one by one
       const progress = Math.min((elapsed - positioningDuration) / expandingDuration, 1);
       const easeOut = 1 - Math.pow(1 - progress, 2);
       
                       concentricTriangles.forEach((triangle, index) => {
         // Stagger the appearance - smallest triangles appear first
         const delay = index * 0.015; // Faster stagger for quicker appearance
         const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
         
         if (adjustedProgress > 0) {
           // Simply fade in the triangle at full size and final position
           const fadeEase = adjustedProgress * adjustedProgress * (3 - 2 * adjustedProgress); // Smoothstep for clean fade
           (triangle.material as THREE.MeshBasicMaterial).opacity = triangle.userData.targetOpacity * fadeEase;
           
           // Keep triangles at their final position (no movement effect)
           triangle.position.z = 0;
         }
       });
       
       // Fade out tetrahedron more gradually
       (tetrahedron.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - easeOut * 0.7);
       
       if (progress >= 1) {
         animationPhase = 'revealing';
         finishStartTime += expandingDuration;
       }
         } else if (animationPhase === 'revealing') {
       // Fade out triangles layer by layer from outside to inside
       const progress = Math.min((elapsed - positioningDuration - expandingDuration) / revealingDuration, 1);
       
       concentricTriangles.forEach((triangle, index) => {
         // Calculate which layer this triangle is (larger index = outer layer)
         const totalLayers = concentricTriangles.length;
         const layerFromOutside = totalLayers - 1 - index; // 0 = outermost, max = innermost
         
         // Each layer takes a portion of the total time to fade
         const layerDuration = 1.2 / totalLayers; // Slightly longer per layer
         const layerStartTime = layerFromOutside * layerDuration * 0.7; // 70% overlap for smoother wave
         const layerEndTime = layerStartTime + layerDuration;
         
         // Calculate fade progress for this specific layer
         let layerProgress = 0;
         if (progress > layerStartTime) {
           if (progress < layerEndTime) {
             layerProgress = (progress - layerStartTime) / layerDuration;
           } else {
             layerProgress = 1; // Fully faded
           }
         }
         
         if (layerProgress > 0) {
           // Ease the fade for smooth disappearing
           const fadeEase = layerProgress * layerProgress * (3 - 2 * layerProgress); // Smoothstep
           const currentOpacity = triangle.userData.targetOpacity * (1 - fadeEase);
           (triangle.material as THREE.MeshBasicMaterial).opacity = Math.max(0, currentOpacity);
           
           // Move triangles backward as they fade for depth effect
           const moveBack = fadeEase * 1.0;
           triangle.position.z = 0 - moveBack;
         }
              });
       
       // Keep container fully visible during triangle animation
       // Container will fade when loading state ends in the main component
     } else if (animationPhase === 'fading-out') {
      // Fade out everything smoothly
      const progress = Math.min((elapsed - positioningDuration - expandingDuration - revealingDuration) / fadeOutDuration, 1);
      const fadeEase = progress * progress * (3 - 2 * progress); // Smoothstep
      
      // Fade out tetrahedron and axes
      (tetrahedron.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - fadeEase);
      
      // Fade out vertex indicators
      if (vertexIndicators) {
        vertexIndicators.visible = fadeEase < 0.5; // Hide when fade is more than 50%
      }
      
      // Fade out any remaining triangles
      concentricTriangles.forEach((triangle) => {
        const currentOpacity = (triangle.material as THREE.MeshBasicMaterial).opacity;
        if (currentOpacity > 0) {
          (triangle.material as THREE.MeshBasicMaterial).opacity = currentOpacity * (1 - fadeEase);
        }
      });
      
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