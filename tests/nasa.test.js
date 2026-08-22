import { describe, expect, it } from 'vitest';
import { escapeHtml, isSafeHttpUrl } from '../js/dom.js';
import { normalizarAsteroides, normalizarImagens } from '../js/nasa.js';

describe('escapeHtml', () => {
  it('escapa tags e aspas', () => {
    expect(escapeHtml('<img src="x" onerror="alert(1)">')).toBe(
      '&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;'
    );
  });

  it('trata valores vazios', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });
});

describe('isSafeHttpUrl', () => {
  it('aceita http(s)', () => {
    expect(isSafeHttpUrl('https://images-assets.nasa.gov/a.jpg')).toBe(true);
    expect(isSafeHttpUrl('http://example.com/a.jpg')).toBe(true);
  });

  it('rejeita javascript e protocolos inválidos', () => {
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,hi')).toBe(false);
    expect(isSafeHttpUrl('')).toBe(false);
  });
});

describe('normalizarAsteroides', () => {
  it('achata o feed e ordena pelo mais próximo', () => {
    const lista = normalizarAsteroides({
      near_earth_objects: {
        '2026-08-20': [
          {
            id: '2',
            name: '(2026 AB)',
            is_potentially_hazardous_asteroid: false,
            estimated_diameter: { meters: { estimated_diameter_min: 10, estimated_diameter_max: 30 } },
            close_approach_data: [{
              relative_velocity: { kilometers_per_second: '12.5' },
              miss_distance: { lunar: '8.2' }
            }]
          }
        ],
        '2026-08-21': [
          {
            id: '1',
            name: '(2026 CD)',
            is_potentially_hazardous_asteroid: true,
            estimated_diameter: { meters: { estimated_diameter_min: 100, estimated_diameter_max: 200 } },
            close_approach_data: [{
              relative_velocity: { kilometers_per_second: '20' },
              miss_distance: { lunar: '1.4' }
            }]
          }
        ]
      }
    });

    expect(lista).toHaveLength(2);
    expect(lista[0].id).toBe('1');
    expect(lista[0].nome).toBe('2026 CD');
    expect(lista[0].perigoso).toBe(true);
    expect(lista[0].diametro).toBe(150);
    expect(lista[0].distancia_lunar).toBe(1.4);
  });

  it('ignora asteroides sem aproximação', () => {
    expect(normalizarAsteroides({
      near_earth_objects: {
        '2026-08-21': [{ id: 'x', name: 'Z', close_approach_data: [] }]
      }
    })).toEqual([]);
  });
});

describe('normalizarImagens', () => {
  it('simplifica o payload da Image Library', () => {
    const itens = normalizarImagens({
      collection: {
        items: [
          {
            data: [{ nasa_id: 'a1', title: 'Mars', description: 'rover', date_created: '2020-01-01T12:00:00Z' }],
            links: [{ href: 'https://images-assets.nasa.gov/a1.jpg' }]
          },
          {
            data: [{ nasa_id: 'a2', title: 'Sem imagem' }]
          }
        ]
      }
    });

    expect(itens).toEqual([
      {
        id: 'a1',
        titulo: 'Mars',
        descricao: 'rover',
        data: '2020-01-01',
        imagem: 'https://images-assets.nasa.gov/a1.jpg'
      }
    ]);
  });
});
