// Cena 3D da Terra para a página NEO.
// Mostra a Terra rotacionando + estrelas + asteroides orbitando.

import * as THREE from 'three';

// Função principal que cria a cena.
// Recebe o canvas onde a Terra vai aparecer, e a lista de asteroides.
export function criarCenaDaTerra(canvas, asteroides) {

  // Tamanho do canvas (pega o que tá definido no CSS).
  const largura = canvas.clientWidth;
  const altura = canvas.clientHeight;

  // ---- SCENE ----
  // É tipo o "palco" 3D onde todos os objetos vão ficar.
  const scene = new THREE.Scene();

  // ---- CAMERA ----
  // Define como a gente "olha" pra cena.
  const camera = new THREE.PerspectiveCamera(40, largura / altura, 0.1, 1000);
  camera.position.set(0, 0.5, 8);

  // ---- RENDERER ----
  // É o que desenha a cena no canvas.
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(largura, altura, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---- TERRA ----
  const terra = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.85,
      metalness: 0.1
    })
  );
  scene.add(terra);

  // ---- WIREFRAME ----
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

  // ---- ATMOSFERA ----
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

  // ---- ESTRELAS ----
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

  const estrelas = new THREE.Points(estrelasGeometry, new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.35,
    transparent: true,
    opacity: 0.7
  }));
  scene.add(estrelas);

  // ---- ASTEROIDES ----
  // Pego no máximo 30 asteroides pra não poluir a cena.
  const listaAsteroides3D = [];
  const limite = Math.min(asteroides.length, 30);

  for (let i = 0; i < limite; i++) {
    const a = asteroides[i];

    // Tamanho da esfera depende do diâmetro real do asteroide,
    // mas com limites pra não ficarem invisíveis ou gigantes.
    const tamanho = Math.max(0.04, Math.min(0.15, a.diametro / 2000));

    // Distância da Terra também varia, e não é a real (LD)
    // porque ficaria absurda em escala. Comprimo pra ficar visível.
    const distancia = 2.3 + Math.min(a.distancia_lunar / 4, 2);

    const cor = a.perigoso ? 0xfc3d21 : 0xffffff;

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(tamanho, 12, 12),
      new THREE.MeshBasicMaterial({ color: cor })
    );

    // Cada asteroide começa numa posição diferente da órbita.
    mesh.userData = {
      angulo: (i / limite) * Math.PI * 2,
      distancia: distancia,
      velocidade: 0.2 + Math.random() * 0.4,
      perigoso: a.perigoso,
      inclinacao: (Math.random() - 0.5) * 0.6
    };

    scene.add(mesh);
    listaAsteroides3D.push(mesh);
  }

  // ---- LUZES ----
  const sol = new THREE.DirectionalLight(0xffffff, 1.3);
  sol.position.set(5, 2, 4);
  scene.add(sol);

  const luzAmbiente = new THREE.AmbientLight(0x4060a0, 0.4);
  scene.add(luzAmbiente);

  // ---- LOOP DE ANIMAÇÃO ----
  let tempo = 0;

  function animar() {
    requestAnimationFrame(animar);
    tempo += 0.01;

    // Rotação da Terra.
    terra.rotation.y += 0.002;
    wireframe.rotation.y += 0.0012;

    // Move os asteroides em suas órbitas.
    for (const mesh of listaAsteroides3D) {
      const dados = mesh.userData;
      const a = dados.angulo + tempo * dados.velocidade;

      mesh.position.x = Math.cos(a) * dados.distancia;
      mesh.position.z = Math.sin(a) * dados.distancia;
      mesh.position.y = Math.sin(a * 0.7 + dados.inclinacao) * 0.4;

      // Asteroides perigosos pulsam (ficam maiores e menores).
      if (dados.perigoso) {
        const escala = 1 + Math.sin(tempo * 4) * 0.35;
        mesh.scale.set(escala, escala, escala);
      }
    }

    renderer.render(scene, camera);
  }

  animar();

  // Quando a janela mudar de tamanho, ajusta a câmera e o renderer.
  window.addEventListener('resize', () => {
    const novaLargura = canvas.clientWidth;
    const novaAltura = canvas.clientHeight;
    if (!novaLargura || !novaAltura) return;

    camera.aspect = novaLargura / novaAltura;
    camera.updateProjectionMatrix();
    renderer.setSize(novaLargura, novaAltura, false);
  });
}