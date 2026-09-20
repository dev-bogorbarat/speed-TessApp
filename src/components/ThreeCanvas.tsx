import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShapeType, VisualFxMode, WarpMode } from '../types';

interface ThreeCanvasProps {
  shape: ShapeType;
  colorHex: number;
  wireframe: boolean;
  rotationSpeedMultiplier: number;
  fxMode?: VisualFxMode;
  warpMode?: WarpMode;
  isTestingSpeed?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  shape,
  colorHex,
  wireframe,
  rotationSpeedMultiplier,
  fxMode = 'standard',
  warpMode = 'normal',
  isTestingSpeed = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const currentObjectRef = useRef<THREE.Object3D | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);
  const starPositionsRef = useRef<Float32Array | null>(null);

  const rotSpeedRef = useRef(rotationSpeedMultiplier);
  rotSpeedRef.current = rotationSpeedMultiplier;

  const warpActiveRef = useRef(warpMode === 'hyperspace' || isTestingSpeed);
  warpActiveRef.current = warpMode === 'hyperspace' || isTestingSpeed;

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Primary Dynamic Neon Point Light
    const pointLight = new THREE.PointLight(colorHex, 3, 60);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    lightRef.current = pointLight;

    // Secondary Cyber Fill Lights
    const blueBackLight = new THREE.PointLight(0x3b82f6, 2, 45);
    blueBackLight.position.set(-5, -4, -3);
    scene.add(blueBackLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 1.5, 40);
    purpleLight.position.set(0, -5, 2);
    scene.add(purpleLight);

    // Mesh Group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Standard Mesh Material
    const material = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: wireframe,
    });
    materialRef.current = material;

    // Points Material
    const pointsMaterial = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.07,
      transparent: true,
      opacity: 0.9,
    });
    pointsMaterialRef.current = pointsMaterial;

    // Background Starfield & Warp Tunnel Particles
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 45;
      velocities[i] = 0.05 + Math.random() * 0.15;
    }

    starPositionsRef.current = positions;

    const starfieldGeo = new THREE.BufferGeometry();
    starfieldGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starfieldMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
    });
    const starfield = new THREE.Points(starfieldGeo, starfieldMat);
    scene.add(starfield);
    starfieldRef.current = starfield;

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Rotate central mesh group
      if (currentObjectRef.current) {
        currentObjectRef.current.rotation.x = elapsedTime * 0.35 * rotSpeedRef.current;
        currentObjectRef.current.rotation.y = elapsedTime * 0.55 * rotSpeedRef.current;
        currentObjectRef.current.position.y = Math.sin(elapsedTime * 1.6) * 0.25;

        if (warpActiveRef.current) {
          // Rapid hyperspace wobble
          currentObjectRef.current.rotation.z += 0.02 * rotSpeedRef.current;
        }
      }

      // Starfield Particle Warp Engine
      if (starfieldRef.current && starPositionsRef.current) {
        const posAttr = starfieldRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const speedMultiplier = warpActiveRef.current ? 7.5 : 0.6;

        for (let i = 0; i < starCount; i++) {
          const zIdx = i * 3 + 2;
          posArray[zIdx] += velocities[i] * speedMultiplier;

          // Loop back if particle passes camera
          if (posArray[zIdx] > 15) {
            posArray[zIdx] = -30;
            posArray[i * 3] = (Math.random() - 0.5) * 35;
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 35;
          }
        }
        posAttr.needsUpdate = true;

        if (warpActiveRef.current) {
          starfieldMat.color.setHex(0x00f0ff);
          starfieldMat.size = 0.08;
          starfieldMat.opacity = 0.85;
        } else {
          starfieldMat.color.setHex(0x38bdf8);
          starfieldMat.size = 0.045;
          starfieldMat.opacity = 0.55;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Geometry and Object when shape or fxMode changes
  useEffect(() => {
    const meshGroup = meshGroupRef.current;
    if (!meshGroup || !materialRef.current || !pointsMaterialRef.current) return;

    if (currentObjectRef.current) {
      meshGroup.remove(currentObjectRef.current);
      if ('geometry' in currentObjectRef.current) {
        (currentObjectRef.current as THREE.Mesh).geometry.dispose();
      }
    }

    let geometry: THREE.BufferGeometry;

    switch (shape) {
      case 'sphere':
        geometry = new THREE.IcosahedronGeometry(2.1, 2);
        break;
      case 'cube':
        geometry = new THREE.BoxGeometry(2.3, 2.3, 2.3, 4, 4, 4);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(2.2, 1);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(2.4, 1);
        break;
      case 'helix':
        // Cyber DNA Twist
        geometry = new THREE.TorusKnotGeometry(1.6, 0.25, 140, 16, 2, 7);
        break;
      case 'torus':
      default:
        geometry = new THREE.TorusKnotGeometry(1.5, 0.42, 130, 18);
        break;
    }

    let obj: THREE.Object3D;

    if (fxMode === 'points') {
      obj = new THREE.Points(geometry, pointsMaterialRef.current);
    } else {
      obj = new THREE.Mesh(geometry, materialRef.current);
    }

    meshGroup.add(obj);
    currentObjectRef.current = obj;
  }, [shape, fxMode]);

  // Update Material styling
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.setHex(colorHex);
      materialRef.current.wireframe = wireframe || fxMode === 'wireframe';

      if (fxMode === 'chrome') {
        materialRef.current.metalness = 0.98;
        materialRef.current.roughness = 0.05;
      } else {
        materialRef.current.metalness = 0.85;
        materialRef.current.roughness = 0.2;
      }
    }

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.color.setHex(colorHex);
    }

    if (lightRef.current) {
      lightRef.current.color.setHex(colorHex);
    }
  }, [colorHex, wireframe, fxMode]);

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ pointerEvents: 'none' }}
    />
  );
};
