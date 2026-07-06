<div align="center">

# 🚀 NASA Explorer

**Dashboard interativo que conecta você ao acervo da NASA em tempo real**

Fotos astronômicas diárias · Asteroides próximos da Terra em 3D · Mais de 150 mil imagens do acervo espacial · Coleção pessoal de favoritos com CRUD completo

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nasa-explorer-nine-rho.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)](./LICENSE)
[![SonarQube](https://img.shields.io/badge/Quality-SonarQube-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)](https://sonarcloud.io)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)
![Back4app](https://img.shields.io/badge/Back4app-1D9EDC?style=flat&logo=parseplatform&logoColor=white)

**[🌐 Ver ao vivo](https://nasa-explorer-nine-rho.vercel.app/)** · **[📸 Screenshots](#-screenshots)** · **[🛠️ Stack](#️-stack-técnica)** · **[💡 Decisões](#-decisões-técnicas)**

![NASA Explorer Preview](./screenshot-nasa-explorer.png)

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

<div align="center">

| Home · Hero + APOD | NEO Watch · Terra 3D + Charts |
|:---:|:---:|
| Foto astronômica do dia + estatísticas em tempo real | Asteroides orbitando a Terra + gráficos interativos |

| Image Library · Busca | Favoritos · CRUD completo |
|:---:|:---:|
| 150K+ imagens do acervo NASA | Coleção pessoal persistida no Back4app |

</div>

## 🛠️ Stack técnica

<table>
<tr>
<td>

**Frontend**
- HTML5 semântico
- CSS3 + Tailwind CSS
- JavaScript vanilla (ES Modules)
- Three.js (visualização 3D)
- Chart.js (gráficos)

</td>
<td>

**Backend & APIs**
- Back4app (Parse SDK)
- NASA APOD API
- NASA NEO Feed API
- NASA Image Library API

</td>
<td>

**Infra & Qualidade**
- Vercel (deploy)
- GitHub (versionamento)
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

### 📱 Responsividade completa
Menu hamburger animado no mobile, layout adaptativo em todas as páginas, imagens otimizadas com `loading="lazy"`.

## 💡 Decisões técnicas

Este é um projeto onde cada decisão foi **consciente e documentada**:

### 1. JavaScript vanilla sem framework
**Por quê**: Como é o 2º período do curso, queria demonstrar **domínio dos fundamentos** antes de recorrer a abstrações. Zero dependências desnecessárias, bundle pequeno, controle total sobre o DOM.

### 2. API Mars Rover → Image Library (pivot forçado)
**Por quê**: A API Mars Rover Photos foi **descontinuada durante o desenvolvimento** (erro "No such app" no Heroku). Como o projeto exigia uma segunda API pública, pivotei para a **NASA Image Library**, que é mais rica (150K+ imagens) e nem requer chave de API. **Lição aprendida**: sempre ter plano B para dependências externas.

### 3. Chave da API NASA visível no client-side
**Por quê**: Como projeto acadêmico com escopo definido, aceitei o trade-off. A chave da NASA API é apenas **rate-limiting** (não protege dados sensíveis), então não há vulnerabilidade real. **Em produção**, ficaria atrás de uma serverless function.

### 4. Sem autenticação de usuário (favoritos compartilhados)
**Por quê**: O requisito principal era **CRUD completo em API REST**. Adicionar auth ampliaria demais o escopo. Documentei essa decisão claramente. **Em produção**, usaria o sistema Users nativo do Parse.

### 5. Suporte a múltiplos formatos de mídia no APOD
**Por quê**: A API da NASA às vezes retorna imagem, às vezes vídeo do YouTube, às vezes MP4 direto. O código identifica o tipo e renderiza cada um apropriadamente — **robustez** em vez de assumir formato único.

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

### Histórico de commits documentado

```bash
bf18bca  fix(sonar): adota top-level await em ES Module (javascript:S7785)
85cc42e  fix(sonar): padroniza nomenclatura em blocos catch (javascript:S7718)
2dc280b  fix(sonar): extrai logica de tipo para funcoes nomeadas (javascript:S3358)
8fff377  fix(sonar): adiciona aria-hidden em videos decorativos de fundo (Web:S4084)
b17ec1b  fix(sri): adiciona Subresource Integrity no Parse SDK
```

## 🎓 O que este projeto demonstra

- ✅ **Fundamentos sólidos** — HTML semântico, CSS moderno, JavaScript ES6+ sem framework
- ✅ **Consumo de APIs REST** — 3 APIs públicas + 1 backend próprio, com tratamento de erros
- ✅ **CRUD completo** — Create, Read, Update, Delete persistidos em backend
- ✅ **Visualizações complexas** — Three.js (3D) e Chart.js (dados)
- ✅ **UX cuidada** — efeitos visuais, responsividade, animações não-intrusivas
- ✅ **Qualidade de código** — SonarQube passando, SRI, acessibilidade
- ✅ **Metodologia profissional** — git com histórico limpo, um commit por feature
- ✅ **Documentação** — README completo, decisões técnicas explicadas, README versionado

## 🚀 Rodando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/vanessa-lima-web/nasa_explorer.git
cd nasa_explorer

# 2. Como é vanilla JS, basta um servidor HTTP local. Ex:
python3 -m http.server 5500
# ou
npx serve

# 3. Abra no navegador
# http://localhost:5500/
```

Nenhuma instalação de dependências necessária — tudo carrega via CDN.

## 📂 Estrutura

```
nasa_explorer/
├── assets/
│   ├── favicon/           # Ícones para todos os dispositivos
│   ├── galaxy.mp4         # Vídeo de fundo (930KB, otimizado)
│   └── og-image.png       # Preview para redes sociais
├── css/
│   └── global.css         # Estilos compartilhados (video, spotlight, cards)
├── js/
│   ├── nasa.js            # Cliente das APIs da NASA
│   ├── parse.js           # Cliente do Back4app (CRUD)
│   └── earthScene.js      # Cena 3D da Terra com Three.js
├── index.html             # Home + APOD
├── neo.html               # Asteroides + Terra 3D + Charts
├── mars.html              # Image Library com busca
├── favoritos.html         # Coleção pessoal (CRUD)
└── README.md
```

## 🤝 Sobre a autora

<table>
<tr>
<td width="150" align="center">
<a href="https://github.com/vanessa-lima-web">
<img src="https://github.com/vanessa-lima-web.png" width="120" style="border-radius: 50%" alt="Vanessa Lima" />
</a>
</td>
<td>

**Vanessa Rafaella Carneiro de Lima**

Estudante de Sistemas para Internet na UNICAP (Pernambuco, Brasil).
Fundadora da VanessenceWeb Ltd (UK). Apaixonada por front-end, UX e qualidade de código.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/vanessa-lima-web)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/vanessa-lima-web)

</td>
</tr>
</table>

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

<div align="center">

**Se este projeto te inspirou, considera dar uma ⭐ no repositório!**

Feito com 💙 em Recife · Pernambuco · Brasil

</div>
