// Cena 3D da Terra para a página NEO.
// Mostra a Terra rotacionando + estrelas + asteroides orbitando.

import * as THREE from 'three';
import { prefersReducedMotion } from './dom.js';

// Função principal que cria a cena.
// Recebe o canvas onde a Terra vai aparecer, e a lista de asteroides.
export function criarCenaDaTerra(canvas, asteroides = []) {
  const largura = canvas.clientWidth;
  const altura = canvas.clientHeight;
  if (!largura || !altura) return { dispose() {} };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, largura / altura, 0.1, 1000);
  camera.position.set(0, 0.5, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(largura, altura, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const terra = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.85,
      metalness: 0.1
    })
  );
  scene.add(terra);

  const wireframe = new THREE.Mesh(
    new THREE.SphereGeometry(1.72, 24, 14),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    })
  );
  scene.add(wireframe);

  const atmosfera = new THREE.Mesh(
    new THREE.SphereGeometry(1.95, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    })
  );
  scene.add(atmosfera);

  const estrelasGeometry = new THREE.BufferGeometry();
  const totalEstrelas = 2000;
  const posicoes = new Float32Array(totalEstrelas * 3);

  for (let i = 0; i < totalEstrelas; i++) {
    const raio = 50 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    posicoes[i * 3] = raio * Math.sin(phi) * Math.cos(theta);
    posicoes[i * 3 + 1] = raio * Math.sin(phi) * Math.sin(theta);
    posicoes[i * 3 + 2] = raio * Math.cos(phi);
  }

  estrelasGeometry.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
  scene.add(new THREE.Points(estrelasGeometry, new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.35,
    transparent: true,
    opacity: 0.7
  })));

  const listaAsteroides3D = [];
  const limite = Math.min(asteroides.length, 30);

  for (let i = 0; i < limite; i++) {
    const asteroide = asteroides[i];
    const tamanho = Math.max(0.04, Math.min(0.15, asteroide.diametro / 2000));
    const distancia = 2.3 + Math.min(asteroide.distancia_lunar / 4, 2);
    const cor = asteroide.perigoso ? 0xfc3d21 : 0xffffff;

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(tamanho, 12, 12),
      new THREE.MeshBasicMaterial({ color: cor })
    );

    mesh.userData = {
      angulo: (i / limite) * Math.PI * 2,
      distancia,
      velocidade: 0.2 + Math.random() * 0.4,
      perigoso: asteroide.perigoso,
      inclinacao: (Math.random() - 0.5) * 0.6
    };

    scene.add(mesh);
    listaAsteroides3D.push(mesh);
  }

  const sol = new THREE.DirectionalLight(0xffffff, 1.3);
  sol.position.set(5, 2, 4);
  scene.add(sol);
  scene.add(new THREE.AmbientLight(0x4060a0, 0.4));

  let tempo = 0;
  let frameId = 0;
  let visivel = true;
  const reduzirMovimento = prefersReducedMotion();

  function desenharFrame(animar) {
    if (animar) {
      tempo += 0.01;
      terra.rotation.y += 0.002;
      wireframe.rotation.y += 0.0012;

      for (const mesh of listaAsteroides3D) {
        const dados = mesh.userData;
        const angulo = dados.angulo + tempo * dados.velocidade;

        mesh.position.x = Math.cos(angulo) * dados.distancia;
        mesh.position.z = Math.sin(angulo) * dados.distancia;
        mesh.position.y = Math.sin(angulo * 0.7 + dados.inclinacao) * 0.4;

        if (dados.perigoso) {
          const escala = 1 + Math.sin(tempo * 4) * 0.35;
          mesh.scale.set(escala, escala, escala);
        }
      }
    } else {
      for (const mesh of listaAsteroides3D) {
        const dados = mesh.userData;
        mesh.position.x = Math.cos(dados.angulo) * dados.distancia;
        mesh.position.z = Math.sin(dados.angulo) * dados.distancia;
        mesh.position.y = Math.sin(dados.inclinacao) * 0.4;
      }
    }

    renderer.render(scene, camera);
  }

  function loop() {
    if (!visivel || document.hidden || reduzirMovimento) return;
    frameId = requestAnimationFrame(loop);
    desenharFrame(true);
  }

  function retomar() {
    cancelAnimationFrame(frameId);
    if (!reduzirMovimento && visivel && !document.hidden) loop();
  }

  function onResize() {
    const novaLargura = canvas.clientWidth;
    const novaAltura = canvas.clientHeight;
    if (!novaLargura || !novaAltura) return;

    camera.aspect = novaLargura / novaAltura;
    camera.updateProjectionMatrix();
    renderer.setSize(novaLargura, novaAltura, false);
    if (reduzirMovimento) desenharFrame(false);
  }

  const observer = new IntersectionObserver((entradas) => {
    visivel = Boolean(entradas[0]?.isIntersecting);
    if (visivel) retomar();
    else cancelAnimationFrame(frameId);
  });
  observer.observe(canvas);

  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', retomar);

  if (reduzirMovimento) {
    desenharFrame(false);
  } else {
    loop();
  }

  return {
    dispose() {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', retomar);
      renderer.dispose();
    }
  };
}
