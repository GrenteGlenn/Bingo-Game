"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function CagnotteTube() {
  const refContainer = useRef();

  useEffect(() => {
    const container = refContainer.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, -1, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableZoom = false;

    controls.update();

    controls.enableDamping = true;

    // 🌟 Groupe pour la cagnotte (tube + base + pièces)
    const cagnotteGroup = new THREE.Group();
    scene.add(cagnotteGroup);

    // Rotation
    let rotationSpeedY = 0;
    const placedCoins = [];

    // Lumières
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemi.position.set(0, 5, 0);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Tube
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 64, 1, true);
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0,
      transmission: 1,
      thickness: 0.1,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    cagnotteGroup.add(tube);

    // Base
    const baseGeo = new THREE.CircleGeometry(1.5, 64);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x00a6d9 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -2;
    cagnotteGroup.add(base);

    // Pièces
    const coins = [];
    const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });

    const dropCoin = () => {
      const coin = new THREE.Mesh(coinGeo, coinMat);

      // Position X/Z aléatoire sur disque
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 1.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      coin.position.set(x, 2.5, z);
      coin.rotation.set(Math.random(), Math.random(), Math.random());

      // Empilement
      const sameSpotCount = placedCoins.filter((c) => {
        const dx = c.position.x - x;
        const dz = c.position.z - z;
        const distSq = dx * dx + dz * dz;
        return distSq < 0.09;
      }).length;

      const yBase = -1.9;
      const yHeight = yBase + sameSpotCount * 0.06;
      const maxY = 2; // hauteur du tube
      coin.userData.targetY = Math.min(yHeight, maxY);

      cagnotteGroup.add(coin);
      coins.push(coin);
    };

    // Clavier
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        dropCoin();
      } else if (e.code === "ArrowLeft") {
        rotationSpeedY = 0.02;
      } else if (e.code === "ArrowRight") {
        rotationSpeedY = -0.02;
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        rotationSpeedY = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const animate = () => {
      requestAnimationFrame(animate);

      // Animation pièces
      for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        const dy = coin.position.y - coin.userData.targetY;

        if (dy > 0.01) {
          coin.position.y -= 0.05;
          coin.rotation.x += 0.1;
          coin.rotation.z += 0.1;
        } else {
          coin.position.y = coin.userData.targetY;
          placedCoins.push(coin);
          coins.splice(i, 1);
        }
      }

      // Rotation du groupe
      cagnotteGroup.rotation.y += rotationSpeedY;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  return <div ref={refContainer} style={{ width: "100%", height: "100vh" }} />;
}
