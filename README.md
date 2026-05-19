# NASA EXPLORER

Dashboard com dados públicos da NASA. Projeto da disciplina de **PROGRAMAÇÃO PARA WEB** 

UNICAP · 2º período de Sistemas para Internet · Professor: Gabriel Fernandes.

## Deploy

🌐 [nasa-explor.netlify.app](https://nasa-explor.netlify.app)

<p align="center">
  <img src="./quality-travel-screenshot.png" alt="QualityTravel Preview" width="100%">
</p>



## Sobre

Painel que junta APIs gratuitas da NASA num lugar só:

- **APOD** — foto astronômica do dia
- **NEO** — asteroides próximos da Terra (com Terra 3D)
- **Mars Rover Photos** — fotos dos rovers em Marte
- **Favoritos** — coleção pessoal salva no Back4app (CRUD)

## Stack

- HTML, CSS, JavaScript (sem framework, só vanilla mesmo)
- [Tailwind CSS](https://tailwindcss.com) via CDN
- [Chart.js](https://www.chartjs.org) pros gráficos
- [Three.js](https://threejs.org) pra cena 3D da Terra
- [Back4app](https://www.back4app.com) como backend

## Rodar localmente

Como uso ES Modules, não dá pra abrir o arquivo direto no navegador (ele bloqueia). Precisa de um servidor:

```bash
python3 -m http.server 5500
```

Aí abre `http://localhost:5500` no navegador.

## Roadmap

- [x] Setup e deploy inicial
- [ ] Home com a foto astronômica do dia
- [ ] NEO Watch (asteroides + Terra 3D + gráficos)
- [ ] Mars Gallery
- [ ] CRUD de favoritos no Back4app
- [ ] Vídeo de demonstração

## Deploy

Em breve no Vercel.

## Observação

A chave da API da NASA fica no JS do client. Pra esse projeto não tem problema (a chave só serve pra rate-limit, não é segredo), mas em produção real o ideal seria por trás de uma função serverless. Decidi manter assim pra o projeto continuar 100% estático.
