<div align="center">

# 🛰️ NASA Explorer

**Dashboard interativo com dados públicos da NASA**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://nasa-explorer-nine-rho.vercel.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

🌐 **[Ver projeto ao vivo →](https://nasa-explorer-nine-rho.vercel.app)**

</div>

---

## 📋 Sobre o projeto

Projeto da disciplina de **Programação para Web** do curso de **Sistemas para Internet** da **UNICAP** — Universidade Católica de Pernambuco (2º período).

Painel que conecta o usuário a múltiplas fontes da NASA em tempo real, com visualizações 3D, gráficos interativos e uma coleção pessoal de favoritos persistida em backend.

**Atividade A07 · Entrega 28/05/2026 · Prof. Gabriel Fernandes**

---

## ✨ Funcionalidades

### 🏠 Home
- **APOD (Astronomy Picture of the Day)** — foto astronômica diária com tratamento para imagem **e vídeo** (a NASA alterna)
- **Stats em tempo real** — asteroides do dia, total de imagens no acervo e favoritos salvos
- **Hero "mission control"** com linha de comando piscando e animações sequenciais

### ☄️ NEO Watch
- **Lista de asteroides próximos da Terra** nos últimos 7 dias
- **Terra 3D em Three.js** rotacionando com asteroides orbitando
- **2 gráficos Chart.js**: barras empilhadas (perigosos vs seguros por dia) + doughnut de proporção
- **Tabela detalhada** com diâmetro, distância em LD (lunar distances), velocidade e status

### 🔭 Image Library
- **Busca em mais de 150 mil imagens** do acervo da NASA Image Library
- **Sugestões rápidas** (mars rover, apollo 11, jupiter, nebula, saturn, ISS)
- **Grid responsivo** com lightbox no hover

### ★ Favoritos (CRUD completo)
- **Create** — salvar APOD, asteroide ou imagem com um clique
- **Read** — lista organizada por tipo e data
- **Update** — adicionar nota pessoal editável
- **Delete** — remover com confirmação

### 🎨 Detalhes visuais
- **Vídeo de fundo** com galáxia em loop em todas as páginas
- **Spotlight cursor** — luz ciano segue o mouse simulando uma lanterna
- **Glow nos cards** no hover seguindo a posição do cursor
- **Spotlight desativado** automaticamente em dispositivos touch

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| **Estrutura** | HTML5 semântico |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com) via CDN + CSS Custom Properties |
| **JavaScript** | Vanilla ES Modules (sem framework) |
| **Gráficos** | [Chart.js 4](https://www.chartjs.org) |
| **3D** | [Three.js 0.158](https://threejs.org) |
| **Backend** | [Back4app](https://www.back4app.com) (Parse SDK) |
| **APIs públicas** | [NASA APIs](https://api.nasa.gov) + [NASA Image Library](https://images.nasa.gov) |
| **Tipografia** | Outfit + JetBrains Mono ([Google Fonts](https://fonts.google.com)) |
| **Deploy** | [Vercel](https://vercel.com) (CDN global, HTTPS automático) |

**Por que vanilla JS?** Mostra domínio dos fundamentos. Sem React, sem build step, sem `node_modules`. O projeto inteiro são arquivos estáticos servidos por CDN — escala infinito de graça.

---

## 📁 Estrutura do projeto

```
nasa_explorer/
├── index.html              # Home com hero e APOD
├── neo.html                # NEO Watch + Terra 3D + gráficos
├── mars.html               # NASA Image Library com busca
├── favoritos.html          # CRUD completo
├── assets/
│   └── galaxy.mp4          # Vídeo de fundo da galáxia
├── css/
│   └── global.css          # Estilos globais (vídeo, spotlight, cards)
├── js/
│   ├── nasa.js             # Cliente das APIs da NASA
│   ├── parse.js            # Cliente do Back4app (CRUD)
│   └── earthScene.js       # Cena 3D da Terra com Three.js
├── .gitignore
└── README.md
```

---

## 🚀 Como rodar localmente

Como o projeto usa **ES Modules**, não dá para abrir o HTML diretamente no navegador (ele bloqueia por segurança). É preciso um servidor local.

### Opção 1: Python (mais simples)

```bash
python3 -m http.server 5500
```

Abre `http://localhost:5500` no navegador.

### Opção 2: VS Code Live Server

Instala a extensão **Live Server** e clica em "Go Live" no canto inferior direito.

---

## 🗄️ Schema do Back4app

**Classe `Favorite`** com Class Level Permissions públicas (decisão consciente — explicado abaixo):

| Campo | Tipo | Descrição |
|---|---|---|
| `objectId` | String | Gerado pelo Back4app |
| `nasaId` | String | ID único na NASA (data do APOD, ID do asteroide ou da imagem) |
| `tipo` | String | `apod`, `neo` ou `image` |
| `titulo` | String | Nome exibível do favorito |
| `imageUrl` | String | URL da imagem (vazio quando for asteroide) |
| `userNote` | String | Nota pessoal editável pelo usuário |
| `createdAt` | Date | Padrão do Parse |
| `updatedAt` | Date | Padrão do Parse |

---

## 💡 Decisões técnicas

Algumas decisões importantes tomadas durante o desenvolvimento — todas conscientes:

### Chave da API exposta no client-side
A chave da NASA fica visível no JavaScript. Para esse projeto **não é um problema de segurança**: a chave serve apenas para rate-limiting (1000 req/hora) e não dá acesso a dados privados. Em produção real, ficaria atrás de uma função serverless. Mantive client-side para o projeto continuar 100% estático e portátil.

### API Mars Rover descontinuada
A API original `mars-photos.herokuapp.com` foi descontinuada no meio do desenvolvimento (passou a retornar página de erro do Heroku). **Pivotei para a NASA Image Library** (`images-api.nasa.gov`), que é mais rica e nem precisa de chave. Mantive a página com nome `mars.html` para não quebrar o histórico de commits.

### APOD aceita vídeo MP4 direto
A API APOD às vezes retorna foto, às vezes retorna vídeo do YouTube, e às vezes retorna **MP4 direto** do servidor da NASA. O código identifica o tipo de mídia e renderiza apropriadamente — `<img>` para imagem, `<iframe>` para YouTube, `<video>` para MP4.

### CRUD sem autenticação
Os favoritos são compartilhados entre todos os visitantes (sem sistema de login). É uma decisão consciente para focar no requisito principal (CRUD funcional) sem extrapolar o escopo da atividade. Em produção, usaria o sistema de Users do Parse.

### Vídeo de fundo otimizado
O vídeo da galáxia foi comprimido para 4.3MB (de 7MB originais) para garantir bom carregamento em conexões móveis. Em `@media (prefers-reduced-motion: reduce)` o vídeo é escondido por acessibilidade.

---

## 🎓 Aprendizados

Coisas que aprendi durante esses 16 dias de desenvolvimento:

- **CSS `z-index` e camadas** para sobrepor vídeo de fundo, overlay escuro e conteúdo sem brigar entre si
- **Three.js do zero** — geometria de esfera, materiais, animação de partículas em órbita
- **Parse SDK** — Class Level Permissions, queries com filtros, padrões de CRUD em backend serverless
- **Debug em ambientes diferentes** — código pode funcionar em Live Server e quebrar em produção por causa de z-index e estrutura HTML inválida
- **Estratégia de fallback** quando uma API que era central pro projeto sai do ar de uma hora pra outra

---

## 📅 Cronograma de desenvolvimento

| Período | Foco |
|---|---|
| 09–10 mai | Setup inicial + deploy |
| 11–12 mai | Home com APOD |
| 13–15 mai | NEO Watch (estrutura + tabela + gráficos) |
| 16–17 mai | Image Library (pivot da Mars Rover descontinuada) |
| 18–20 mai | Back4app + CRUD de favoritos |
| 21–22 mai | Hero moderna + vídeo de fundo + spotlight |
| 23–24 mai | Polimento, fixes e ajustes finais |
| 25 mai | README + vídeo + entrega |

---

## 📺 Demonstração

🎬 **Vídeo de apresentação (4min)** — disponível na entrega da atividade

🌐 **Site no ar** — [nasa-explorer-nine-rho.vercel.app](https://nasa-explorer-nine-rho.vercel.app)

---

## 👩‍💻 Autora

**Vanessa Lima**
2º período de Sistemas para Internet — UNICAP
📧 vanessa.00000858443@unicap.br

---

<div align="center">

*Feito com 🛰️ e muito café entre maio/2026*

</div>