// Cena 3D da Terra para a página NEO.
// Por enquanto só a Terra rotacionando com estrelas de fundo.
// Os asteroides vão entrar no próximo commit.

import * as THREE from 'three';

// Função principal que cria a cena.
// Recebe o canvas onde a Terra vai aparecer.
export function criarCenaDaTerra(canvas) {

  // Tamanho do canvas (pega o que tá definido no CSS).
  const largura = canvas.clientWidth;
  const altura = canvas.clientHeight;

  // ---- SCENE ----
  // É tipo o "palco" 3D onde todos os objetos vão ficar.
  const scene = new THREE.Scene();

  // ---- CAMERA ----
  // Define como a gente "olha" pra cena.
  // Os parâmetros são: ângulo de visão, proporção, distância mínima, distância máxima.
  const camera = new THREE.PerspectiveCamera(40, largura / altura, 0.1, 1000);
  camera.position.set(0, 0.5, 8); // posição: levemente acima e afastado

  // ---- RENDERER ----
  // É o que desenha a cena no canvas.
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,  // bordas suaves
    alpha: true       // fundo transparente
  });
  renderer.setSize(largura, altura, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---- TERRA ----
  // Esfera azul que representa a Terra.
  const terra = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 48, 48), // raio 1.7, com 48 segmentos
    new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,  // azul escuro
      roughness: 0.85,
      metalness: 0.1
    })
  );
  scene.add(terra);

  // ---- WIREFRAME ----
  // Uma esfera de "grade" por cima da terra, dá um visual de radar/satélite.
  const wireframe = new THREE.Mesh(
    new THREE.SphereGeometry(1.72, 24, 14),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,  // ciano
      wireframe: true,
      transparent: true,
      opacity: 0.18
    })
  );
  scene.add(wireframe);

  // ---- ATMOSFERA ----
  // Esfera maior por fora, com material por dentro, simula o brilho da atmosfera.
  const atmosfera = new THREE.Mesh(
    new THREE.SphereGeometry(1.95, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide  // renderiza só o lado de dentro
    })
  );
  scene.add(atmosfera);

  // ---- ESTRELAS ----
  // 2000 pontinhos brancos distribuídos numa esfera enorme em volta.
  const estrelasGeometry = new THREE.BufferGeometry();
  const totalEstrelas = 2000;
  const posicoes = new Float32Array(totalEstrelas * 3);

  for (let i = 0; i < totalEstrelas; i++) {
    // Posição aleatória dentro de uma esfera grande.
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

  // ---- LUZES ----
  // Sem luz, a Terra fica toda preta (porque ela usa MeshStandardMaterial).
  const sol = new THREE.DirectionalLight(0xffffff, 1.3);
  sol.position.set(5, 2, 4);
  scene.add(sol);

  // Luz ambiente fraca pra não ficar totalmente preto no lado escuro.
  const luzAmbiente = new THREE.AmbientLight(0x4060a0, 0.4);
  scene.add(luzAmbiente);

  // ---- LOOP DE ANIMAÇÃO ----
  // Função que roda 60 vezes por segundo pra desenhar a cena.
  function animar() {
    requestAnimationFrame(animar);

    // Faz a Terra rotacionar um pouquinho a cada frame.
    terra.rotation.y += 0.002;
    wireframe.rotation.y += 0.0012;

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