```markdown
<div align="center">
  <h1>🛰️ NASA Explorer</h1>
  <p><strong>Dashboard interativo com dados públicos da NASA</strong></p>

  [![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://nasa-explorer-nine-rho.vercel.app)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

  🌐 **[Ver projeto ao vivo →](https://nasa-explorer-nine-rho.vercel.app)**
</div>

---

## 📋 Sobre o Projeto

Projeto desenvolvido na disciplina de **Programação para Web** (2º período) do curso de **Sistemas para Internet** na **Unicap** — Universidade Católica de Pernambuco.

Um painel completo que integra múltiplas APIs da NASA, oferecendo visualizações 3D, gráficos interativos, busca em acervo de imagens e sistema de favoritos com backend persistente.

**Nota da atividade**: 10/10

---

## ✨ Funcionalidades

- **Home** — APOD (imagem/vídeo), estatísticas em tempo real e hero animado
- **NEO Watch** — Asteroides próximos da Terra, Terra 3D com Three.js, gráficos Chart.js e tabela detalhada
- **Image Library** — Busca avançada em +150 mil imagens da NASA com grid responsivo
- **Favoritos** — CRUD completo (Create, Read, Update, Delete) com notas pessoais
- **Efeitos Visuais** — Vídeo de fundo, spotlight cursor, glow dinâmico e design dark imersivo

**Totalmente responsivo** (mobile-first) e otimizado para performance.

---

## 🛠️ Tecnologias

- **Frontend**: HTML5 semântico, CSS3 (Tailwind + Custom Properties), Vanilla JavaScript (ES Modules)
- **Visualização Avançada**: Three.js, Chart.js
- **Backend**: Back4app (Parse SDK)
- **APIs**: NASA APOD, NEO e Image Library
- **Deploy**: Vercel

**Destaque**: Projeto desenvolvido 100% com vanilla JS para demonstrar domínio sólido dos fundamentos de front-end (HTML, CSS e JavaScript).

---

## 📁 Estrutura do Projeto

```bash
nasa_explorer/
├── index.html              # Home + APOD
├── neo.html                # NEO Watch + 3D + gráficos
├── mars.html               # Image Library
├── favoritos.html          # CRUD Favoritos
├── assets/galaxy.mp4       # Vídeo de fundo otimizado
├── css/global.css
├── js/
│   ├── nasa.js
│   ├── parse.js
│   └── earthScene.js
└── README.md
```

---

## 🚀 Como Rodar Localmente

```bash
python3 -m http.server 5500
# Acesse: http://localhost:5500
```

*(Recomendado: VS Code + extensão Live Server)*

---

## 🎬 Demonstração

[▶️ Assista à apresentação do projeto (4 minutos)](https://drive.google.com/file/d/1uy9Unl2sCafhnsRUcW9VM3QBPwiVXQ8E/view?usp=sharing)

---

## 📸 Screenshots

![Home Page](screenshot-home.png)  
![NEO Watch 3D + Gráficos](screenshot-neo.png)  
![Image Library](screenshot-library.png)  
![Favoritos CRUD](screenshot-favoritos.png)

---

## 👩‍💻 Autora

**Vanessa Lima**  
Desenvolvedora Front-end • Aluna de Sistemas para Internet — Unicap  
[LinkedIn](https://www.linkedin.com/in/vanessa-lima-dev) | [GitHub](https://github.com/VANESSENCEWEB)

*Maio/2026 • Feito com dedicação e café ☕*
```

**Pronto!** Copie tudo acima e cole no README.md. Depois só adicione os screenshots.
