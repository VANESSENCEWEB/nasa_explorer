<div align="center">


# 🚀 NASA Explorer

**Dashboard interativo que conecta você ao acervo da NASA em tempo real**

Fotos astronômicas diárias · Asteroides próximos da Terra em 3D · Mais de 150 mil imagens do acervo espacial · Coleção pessoal de favoritos com CRUD completo

<br />

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nasa-explorer-nine-rho.vercel.app/)
[![License MIT](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)](./LICENSE)
[![SonarQube](https://img.shields.io/badge/Quality-SonarQube-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)](https://sonarcloud.io)
[![Watch Demo](https://img.shields.io/badge/▶_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/vbOrAQKDy9c)

<br />

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)
![Back4app](https://img.shields.io/badge/Back4app-1D9EDC?style=flat&logo=parseplatform&logoColor=white)

<br />

**[🌐 Ver ao vivo](https://nasa-explorer-nine-rho.vercel.app/)** ·
**[📸 Screenshots](#-screenshots)** ·
**[🎥 Demo em vídeo](#-demo-em-vídeo)** ·
**[🛠️ Stack](#️-stack-técnica)** ·
**[💡 Decisões](#-decisões-técnicas)** ·
**[🔒 Qualidade](#-qualidade-de-código-sonarqube)**

</div>

---

## 📖 Sobre o projeto

O **NASA Explorer** nasceu como um projeto acadêmico da disciplina de Programação para Web (UNICAP · 2º período de Sistemas para Internet), mas foi construído com **mentalidade de produto real**: código versionado com histórico limpo, deploy em produção, análise de qualidade contínua e responsividade em qualquer dispositivo.

Em uma única aplicação, o usuário pode:

- 🌌 **Ver a foto astronômica do dia** direto da NASA (atualizada diariamente)
- ☄️ **Monitorar asteroides próximos da Terra** com visualização 3D em tempo real
- 🔭 **Buscar em mais de 150 mil imagens** do acervo espacial oficial
- ⭐ **Salvar favoritos** em backend persistente (CRUD completo)

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="./screenshot-home.jpg" alt="Home do NASA Explorer mostrando o hero mission control com titulo Explore o cosmos em tempo real e a foto astronomica do dia" loading="lazy" />
      <br />
      <sub><b>🏠 Home</b> · Hero mission control + APOD do dia</sub>
    </td>
    <td align="center" width="50%">
      <img src="./screenshot-nasa-explorer.jpg" alt="Pagina NEO Watch mostrando a Terra 3D em wireframe rodeada por asteroides orbitando e graficos Chart.js" loading="lazy" />
      <br />
      <sub><b>☄️ NEO Watch</b> · Terra 3D em Three.js + Chart.js</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="./screenshot-library.jpg" alt="Pagina Image Library com galeria de imagens da NASA em grid responsivo" loading="lazy" />
      <br />
      <sub><b>🔭 Image Library</b> · Busca no acervo com 150K+ imagens</sub>
    </td>
    <td align="center" width="50%">
      <img src="./screenshot-favoritos.jpg" alt="Pagina Favoritos mostrando cards da colecao pessoal salvos no Back4app com botoes de editar nota e remover" loading="lazy" />
      <br />
      <sub><b>⭐ Favoritos</b> · CRUD completo persistido no Back4app</sub>
    </td>
  </tr>
</table>

## 🎥 Demo em vídeo

Neste vídeo de 4 minutos, eu apresento o projeto ao vivo — passando por cada uma das 4 páginas, mostrando o CRUD funcionando, a integração com as APIs da NASA e explicando as principais decisões técnicas por trás da implementação.

<div align="center">

<a href="https://youtu.be/vbOrAQKDy9c" target="_blank">
  <img src="https://img.youtube.com/vi/vbOrAQKDy9c/maxresdefault.jpg" alt="Clique para assistir a demo em video do NASA Explorer no YouTube" width="720" />
  <br />
  <sub><b>▶️ Assistir no YouTube · 4 min</b></sub>
</a>

</div>

<details>
<summary><b>📋 Roteiro do vídeo (o que você vai ver)</b></summary>

- **0:00 – 0:25** · Abertura + apresentação + spotlight cursor
- **0:25 – 0:50** · Seção "Sobre o projeto" + cards de tecnologias
- **0:50 – 1:20** · Home / APOD + stats em tempo real
- **1:20 – 2:05** · NEO Watch + Terra 3D + gráficos Chart.js
- **2:05 – 2:35** · Image Library + pivot da API Mars Rover
- **2:35 – 3:25** · CRUD completo (Create · Read · Update · Delete)
- **3:25 – 3:50** · Três decisões técnicas conscientes
- **3:50 – 4:00** · Fechamento + responsividade

</details>

## 🛠️ Stack técnica

<table>
<tr>
<td width="33%">

**Frontend**
- HTML5 semântico
- CSS3 + Tailwind CSS
- JavaScript vanilla (ES Modules)
- Three.js (visualização 3D)
- Chart.js (gráficos)

</td>
<td width="33%">

**Backend & APIs**
- Back4app (Parse SDK)
- NASA APOD API
- NASA NEO Feed API
- NASA Image Library API

</td>
<td width="33%">

**Infra & Qualidade**
- Vercel (deploy + API serverless)
- GitHub (versionamento)
- Vitest + GitHub Actions (testes)
- SonarQube (qualidade)
- Subresource Integrity (SRI)

</td>
</tr>
</table>

## ✨ Features destacadas

### 🌍 Terra 3D interativa
Modelo esférico wireframe renderizado com **Three.js**, orbitado por asteroides posicionados dinamicamente conforme dados da NASA NEO API. Cada asteroide é uma esfera cuja cor e tamanho refletem sua periculosidade.

### 📊 Gráficos em tempo real
Dois gráficos com **Chart.js** que resumem os asteroides dos últimos 7 dias: **barras empilhadas** por dia (perigosos vs seguros) e **doughnut** com a proporção total.

### 🎨 Efeitos visuais únicos
- **Spotlight cursor** — uma luz radial segue o mouse pela página (CSS puro)
- **Cards com glow interativo** — brilho ciano acompanha o cursor dentro de cada card
- **Vídeo de galáxia como fundo** — otimizado para 930KB, compatível com todos os dispositivos
- **Título com efeito glitch** aleatório na palavra "cosmos"
- **Typewriter** rotacionando 4 frases sobre o projeto

### 🔐 Conta e favoritos privados
Cadastro e login com **Parse Users** (e-mail + senha). Cada favorito novo é gravado com ACL só do dono — a coleção deixa de ser um balde compartilhado.
Clique numa imagem da galeria, da foto do dia ou dos favoritos para ampliá-la. Ações de CRUD agora confirmam com toasts em vez de falhar em silêncio.

### 📱 Responsividade e acessibilidade
Menu hamburger animado no mobile, skip link, `aria-current` na navegação, labels em formulários, `prefers-reduced-motion` (pausa vídeo, 3D e typewriter) e foco visível em teclado.

## 💡 Decisões técnicas

Este é um projeto onde cada decisão foi **consciente e documentada**:

<details>
<summary><b>1. JavaScript vanilla sem framework</b></summary>

Como é o 2º período do curso, queria demonstrar **domínio dos fundamentos** antes de recorrer a abstrações. Zero dependências desnecessárias, bundle pequeno, controle total sobre o DOM.

</details>

<details>
<summary><b>2. API Mars Rover → Image Library (pivot forçado)</b></summary>

A API Mars Rover Photos foi **descontinuada durante o desenvolvimento** (erro "No such app" no Heroku). Como o projeto exigia uma segunda API pública, pivotei para a **NASA Image Library**, que é mais rica (150K+ imagens) e nem requer chave de API.

**Lição aprendida**: sempre ter plano B para dependências externas.

</details>

<details>
<summary><b>3. Chave da API NASA no servidor</b></summary>

A chave da NASA API é só **rate-limiting**, mas no client ela aparece no DevTools. Em produção as rotas APOD e NEO passam por `/api/nasa` na Vercel. Configure `NASA_API_KEY` no painel da Vercel (há um `.env.example` no repositório). No `python -m http.server` local, o proxy não existe e o app cai na `DEMO_KEY` pública da NASA.

</details>

<details>
<summary><b>4. Favoritos privados com Parse Users</b></summary>

O CRUD acadêmico começou com uma coleção compartilhada. Agora cada pessoa cria conta (e-mail + senha) no **Parse Users**. Os favoritos novos levam `user` + ACL só do dono: outra conta não lê, não edita e não apaga. No Back4app, em *Favorite → Security*, o ideal é restringir Find/Get/Create/Update/Delete a usuários autenticados (não Public).

</details>

<details>
<summary><b>5. Suporte a múltiplos formatos de mídia no APOD</b></summary>

A API da NASA às vezes retorna imagem, às vezes vídeo do YouTube, às vezes MP4 direto. O código identifica o tipo e renderiza cada um apropriadamente — **robustez** em vez de assumir formato único.

</details>

## 🔒 Qualidade de código (SonarQube)

Após a entrega, submeti o projeto ao **SonarQube Cloud** para análise de qualidade contínua. Cada issue detectada foi **corrigida em commit separado** com mensagem descritiva, documentando a metodologia profissional.

### Issues corrigidas no `favoritos.html`

| # | Regra | Severidade | Solução |
|---|---|---|---|
| 1 | [`Web:S5725`](https://rules.sonarsource.com/html/RSPEC-5725) | Security · Low | **Subresource Integrity (SRI)** adicionado no Parse SDK com hash SHA-384 |
| 2 | [`Web:S4084`](https://rules.sonarsource.com/html/RSPEC-4084) | Accessibility · Medium | `aria-hidden="true"` em vídeos decorativos (sem áudio, apenas visual) |
| 3 | [`javascript:S3358`](https://rules.sonarsource.com/javascript/RSPEC-3358) | Maintainability · Medium | Ternário aninhado extraído para funções nomeadas com responsabilidade única |
| 4 | [`javascript:S7718`](https://rules.sonarsource.com/javascript/RSPEC-7718) | Maintainability · Low | Nomenclatura padronizada em blocos `catch` (`erro` → `error_`) |
| 5 | [`javascript:S7785`](https://rules.sonarsource.com/javascript/RSPEC-7785) | Maintainability · Medium | Adoção de **top-level await** em ES Module para propagação correta de erros |

<details>
<summary><b>📜 Histórico de commits documentado</b></summary>

```bash
bf18bca  fix(sonar): adota top-level await em ES Module (javascript:S7785)
85cc42e  fix(sonar): padroniza nomenclatura em blocos catch (javascript:S7718)
2dc280b  fix(sonar): extrai logica de tipo para funcoes nomeadas (javascript:S3358)
8fff377  fix(sonar): adiciona aria-hidden em videos decorativos de fundo (Web:S4084)
b17ec1b  fix(sri): adiciona Subresource Integrity no Parse SDK
```

Cada commit resolve **uma única issue**, seguindo Conventional Commits. O histórico completo pode ser explorado com `git log --oneline` no repositório.

</details>

### Polimento de apresentação

Além do SonarQube, a base foi reorganizada para portfolio:

- JS duplicado (menu, spotlight) extraído para módulos compartilhados
- HTML das páginas sem scripts inline longos
- Escape de HTML em dados das APIs (XSS)
- SRI no Parse SDK e no Chart.js
- Headers de segurança e cache no `vercel.json`
- Screenshots do README comprimidos (~8 MB de PNG → ~560 KB de JPEG)
- Manifest PWA com nome, cores e caminhos de ícone corretos
- Página 404, `robots.txt` e `sitemap.xml`
- Tailwind compilado (sem CDN de desenvolvimento)
- Proxy serverless da NASA API + testes Vitest no CI
- Autenticação Parse Users com favoritos privados (ACL por dono)

## 🎓 O que este projeto demonstra

- ✅ **Fundamentos sólidos** — HTML semântico, CSS moderno, JavaScript ES6+ sem framework
- ✅ **Consumo de APIs REST** — 3 APIs públicas + 1 backend próprio, com tratamento de erros
- ✅ **CRUD completo** — Create, Read, Update, Delete persistidos em backend
- ✅ **Autenticação** — Parse Users, favoritos privados por conta (ACL)
- ✅ **Visualizações complexas** — Three.js (3D) e Chart.js (dados)
- ✅ **UX cuidada** — efeitos visuais, lightbox, toasts, responsividade, animações não-intrusivas
- ✅ **Qualidade de código** — SonarQube, SRI, sanitização XSS, módulos ES, acessibilidade
- ✅ **Testes e CI** — Vitest no GitHub Actions
- ✅ **SEO e compartilhamento** — canonical, Open Graph, JSON-LD, sitemap, robots.txt
- ✅ **Metodologia profissional** — git com histórico limpo, um commit por feature
- ✅ **Documentação** — README completo, decisões técnicas explicadas, versionada

## 🚀 Rodando localmente

**Requisitos**: navegador moderno + qualquer servidor HTTP local.

```bash
# 1. Clone o repositório
git clone https://github.com/VANESSENCEWEB/nasa_explorer.git
cd nasa_explorer

# 2. Sobe um servidor HTTP local (escolha uma opção)
python3 -m http.server 5500      # Python 3
# ou
npx serve                         # Node
# ou
php -S localhost:5500              # PHP

# 3. Abra no navegador
# http://localhost:5500/
```

O app **não precisa de `npm install`** para rodar: CSS já vai compilado no repositório. APOD/NEO no `python -m http.server` usam a `DEMO_KEY` da NASA; no deploy da Vercel passam pelo proxy `/api/nasa`.

Na Vercel, em **Settings → Environment Variables**, crie `NASA_API_KEY` (Production e Preview) com a chave de [api.nasa.gov](https://api.nasa.gov). Depois disso, vale rotacionar a chave antiga.

```bash
# Opcional — testes e rebuild do CSS
npm install
npm test
npm run build:css    # só se você alterar classes Tailwind
```

## 📂 Estrutura

```
nasa_explorer/
├── api/
│   └── nasa.js            # Proxy serverless da NASA (APOD + NEO)
├── assets/
│   ├── favicon/           # Ícones + web manifest
│   ├── galaxy.mp4         # Vídeo de fundo (930KB, otimizado)
│   └── og-image.png       # Preview para redes sociais
├── css/
│   ├── input.css          # Entrada do Tailwind
│   ├── utilities.css      # Tailwind compilado
│   └── global.css         # Estilos do projeto (layout, a11y, lightbox)
├── js/
│   ├── ui.js              # Menu, spotlight, toasts, lightbox
│   ├── dom.js             # Helpers de sanitização e a11y
│   ├── nasa.js            # Cliente das APIs da NASA
│   ├── parse.js           # Back4app: auth + CRUD de favoritos
│   ├── authMessages.js    # Mensagens de erro de login/cadastro
│   ├── earthScene.js      # Cena 3D da Terra com Three.js
│   └── pages/             # Lógica de cada página
├── tests/                 # Vitest (normalização de APIs + sanitização)
├── index.html             # Home + APOD
├── neo.html               # Asteroides + Terra 3D + Charts
├── mars.html              # Image Library com busca
├── favoritos.html         # Login + coleção pessoal (CRUD privado)
├── 404.html               # Página de erro
├── robots.txt · sitemap.xml · vercel.json
├── LICENSE
└── README.md
```

## 🗺️ Roadmap

Ideias exploradas para próximas versões (contribuições e forks são bem-vindos):

- [x] Autenticação com Parse Users (favoritos privados por usuário)
- [x] Mover chave da NASA API para serverless function na Vercel
- [x] Migrar Tailwind CDN para CSS compilado
- [x] Adicionar testes automatizados (Vitest + GitHub Actions)
- [ ] PWA com service worker para uso offline
- [ ] Modo escuro / claro (atualmente só escuro)
- [ ] Internacionalização (PT-BR / EN)

## 🤝 Contribuindo

Este projeto é acadêmico, mas contribuições são bem-vindas:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feat/minha-feature`)
3. Commit as mudanças seguindo [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m "feat: adiciona minha feature"`)
4. Push para a branch (`git push origin feat/minha-feature`)
5. Abra um Pull Request

## 👩‍💻 Sobre a autora

<table>
<tr>
<td width="150" align="center">
<a href="https://github.com/VANESSENCEWEB">
<img src="https://github.com/VANESSENCEWEB.png" width="120" style="border-radius: 50%" alt="Foto de perfil de Vanessa Lima no GitHub" />
</a>
</td>
<td>

**Vanessa Rafaella Carneiro de Lima**

Estudante de Sistemas para Internet na UNICAP (Pernambuco, Brasil).
Fundadora da VanessenceWeb Ltd (UK). Apaixonada por front-end, UX e qualidade de código.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/vanessa-lima-web)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/VANESSENCEWEB)

</td>
</tr>
</table>

## 🙏 Créditos e agradecimentos

- **NASA Open APIs** — pelas APIs públicas gratuitas ([api.nasa.gov](https://api.nasa.gov))
- **Back4app** — pelo backend serverless gratuito ([back4app.com](https://www.back4app.com))
- **Vercel** — pelo deploy gratuito com CI/CD ([vercel.com](https://vercel.com))
- **UNICAP** — pela oportunidade de aplicar teoria em prática

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

<div align="center">

**Se este projeto te inspirou, considera dar uma ⭐ no repositório!**

Feito com 💙 em Recife · Pernambuco · Brasil

</div>
