import { fetchNeoFeed } from '../nasa.js';
import { criarCenaDaTerra } from '../earthScene.js';
import { criarFavorito, estaSalvo, deletarFavorito } from '../parse.js';
import { $, escapeHtml } from '../dom.js';
import { mostrarToast, lidarErroFavorito } from '../ui.js';

export function iniciarNeo() {
  const status = $('status');
  const stats = $('stats');
  const tabelaContainer = $('tabela-container');
  const tabelaCorpo = $('tabela-corpo');
  if (!status || !tabelaCorpo) return;

  const favoritados = new Map();

  function getIntervaloPadrao() {
    const hoje = new Date();
    const inicio = new Date();
    inicio.setDate(hoje.getDate() - 6);
    return {
      inicio: inicio.toISOString().split('T')[0],
      fim: hoje.toISOString().split('T')[0]
    };
  }

  function formatarData(isoDate) {
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short'
    });
  }

  function atualizarBotaoFav(btn, salvo) {
    btn.textContent = salvo ? '★' : '☆';
    btn.className = salvo
      ? 'btn-fav text-base transition text-glow'
      : 'btn-fav text-base transition text-slate-600 hover:text-white';
    btn.setAttribute('aria-pressed', String(salvo));
    btn.setAttribute('aria-label', salvo ? `Remover ${btn.dataset.nome} dos favoritos` : `Salvar ${btn.dataset.nome} nos favoritos`);
  }

  async function carregar() {
    try {
      const { inicio, fim } = getIntervaloPadrao();
      const asteroides = await fetchNeoFeed(inicio, fim);

      if (!asteroides.length) {
        status.textContent = 'Nenhum asteroide encontrado para este intervalo.';
        status.classList.remove('hidden');
        return;
      }

      status.classList.add('hidden');
      stats.classList.remove('hidden');
      tabelaContainer.classList.remove('hidden');

      const perigosos = asteroides.filter((a) => a.perigoso);
      $('stat-total').textContent = String(asteroides.length);
      $('stat-perigosos').textContent = String(perigosos.length);
      $('stat-proximo').textContent = `${asteroides[0].distancia_lunar.toFixed(1)} LD`;

      const maisRapido = Math.max(...asteroides.map((a) => a.velocidade));
      $('stat-rapido').textContent = `${maisRapido.toFixed(1)} km/s`;

      criarCenaDaTerra($('earth-canvas'), asteroides);
      $('graficos').classList.remove('hidden');

      const contagemPorDia = {};
      for (const asteroide of asteroides) {
        if (!contagemPorDia[asteroide.data]) {
          contagemPorDia[asteroide.data] = { seguros: 0, perigosos: 0 };
        }
        if (asteroide.perigoso) contagemPorDia[asteroide.data].perigosos += 1;
        else contagemPorDia[asteroide.data].seguros += 1;
      }

      const datasOrdenadas = Object.keys(contagemPorDia).sort();
      const labels = datasOrdenadas.map(formatarData);
      const dadosSeguros = datasOrdenadas.map((d) => contagemPorDia[d].seguros);
      const dadosPerigosos = datasOrdenadas.map((d) => contagemPorDia[d].perigosos);

      const ChartLib = window.Chart;
      if (!ChartLib) throw new Error('Chart.js não carregou');

      new ChartLib($('grafico-barras'), {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Seguros', data: dadosSeguros, backgroundColor: '#06b6d4', borderRadius: 3 },
            { label: 'Perigosos', data: dadosPerigosos, backgroundColor: '#fc3d21', borderRadius: 3 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 } }
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
            y: {
              stacked: true,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#64748b', font: { size: 10 }, stepSize: 1 },
              beginAtZero: true
            }
          }
        }
      });

      new ChartLib($('grafico-doughnut'), {
        type: 'doughnut',
        data: {
          labels: ['Seguros', 'Perigosos'],
          datasets: [{
            data: [asteroides.length - perigosos.length, perigosos.length],
            backgroundColor: ['#06b6d4', '#fc3d21'],
            borderColor: '#0a0e27',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 } }
          }
        }
      });

      const perigososOrdenados = asteroides.filter((a) => a.perigoso);
      const segurosOrdenados = asteroides.filter((a) => !a.perigoso);
      const top20 = [...perigososOrdenados, ...segurosOrdenados].slice(0, 20);

      favoritados.clear();
      await Promise.all(top20.map(async (a) => {
        const id = await estaSalvo(a.id);
        if (id) favoritados.set(a.id, id);
      }));

      tabelaCorpo.innerHTML = top20.map((a) => {
        const tag = a.perigoso
          ? '<span class="bg-red-500/15 text-red-300 px-2 py-0.5 rounded text-[10px] tracking-wider">PERIGOSO</span>'
          : '<span class="bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded text-[10px] tracking-wider">SEGURO</span>';
        const salvo = favoritados.has(a.id);
        const estrela = salvo ? '★' : '☆';
        const corEstrela = salvo ? 'text-glow' : 'text-slate-600 hover:text-white';
        const nome = escapeHtml(a.nome);

        return `
          <tr class="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
            <td class="py-2.5 px-2 text-white">${nome}</td>
            <td class="py-2.5 px-2 text-slate-400">${escapeHtml(formatarData(a.data))}</td>
            <td class="py-2.5 px-2 font-mono text-slate-300">${a.diametro} m</td>
            <td class="py-2.5 px-2 font-mono text-slate-300">${a.distancia_lunar.toFixed(2)} LD</td>
            <td class="py-2.5 px-2 font-mono text-slate-300">${a.velocidade.toFixed(1)} km/s</td>
            <td class="py-2.5 px-2">${tag}</td>
            <td class="py-2.5 px-2 text-right">
              <button type="button" class="btn-fav ${corEstrela} text-base transition"
                data-nasa-id="${escapeHtml(a.id)}"
                data-nome="${nome}"
                data-perigoso="${a.perigoso}"
                aria-pressed="${salvo}"
                aria-label="${salvo ? `Remover ${nome} dos favoritos` : `Salvar ${nome} nos favoritos`}">${estrela}</button>
            </td>
          </tr>
        `;
      }).join('');

      tabelaCorpo.querySelectorAll('.btn-fav').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const nasaId = btn.dataset.nasaId;
          const nome = btn.dataset.nome;
          const perigoso = btn.dataset.perigoso === 'true';

          btn.disabled = true;
          try {
            if (favoritados.has(nasaId)) {
              await deletarFavorito(favoritados.get(nasaId));
              favoritados.delete(nasaId);
              atualizarBotaoFav(btn, false);
              mostrarToast('Asteroide removido dos favoritos.', 'ok');
            } else {
              const salvo = await criarFavorito({
                tipo: 'neo',
                nasaId,
                titulo: `Asteroide ${nome}${perigoso ? ' (perigoso)' : ''}`,
                imageUrl: ''
              });
              favoritados.set(nasaId, salvo.id);
              atualizarBotaoFav(btn, true);
              mostrarToast('Asteroide salvo nos favoritos.', 'ok');
            }
          } catch (erro) {
            console.error(erro);
            if (!lidarErroFavorito(erro)) {
              mostrarToast('Não foi possível atualizar o favorito.', 'erro');
            }
          } finally {
            btn.disabled = false;
          }
        });
      });
    } catch (erro) {
      console.error(erro);
      status.innerHTML = `<span class="text-nasa">ERRO · ${escapeHtml(erro.message)}</span>`;
    }
  }

  carregar();
}
