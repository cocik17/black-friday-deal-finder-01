// Bargain Beacon: a deal finder that runs from its own files, no network.
// Routes: #/ is the list (filters live in the hash so a view is shareable),
// #/deal/<id> is one deal with its cross-store comparison.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from './data.js';
import { percentOff, sortDeals } from './score.js';
import { dealPage, listPage, missingPage } from './views.js';

const app = document.getElementById('app');

const CATEGORIES = [...new Set(deals.map((d) => d.category))].sort();
const STORES = [...new Set(deals.map((d) => d.store))].sort();

function readState() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [path, query] = hash.split('?');
  const params = new URLSearchParams(query || '');
  return {
    deal: path.startsWith('deal/') ? decodeURIComponent(path.slice(5)) : null,
    q: params.get('q') || '',
    cat: params.get('cat') || 'All',
    store: params.get('store') || 'All stores',
    min: Number(params.get('min') || 0),
    sort: params.get('sort') || 'score',
  };
}

function writeState(state) {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.cat !== 'All') params.set('cat', state.cat);
  if (state.store !== 'All stores') params.set('store', state.store);
  if (state.min > 0) params.set('min', String(state.min));
  if (state.sort !== 'score') params.set('sort', state.sort);
  const query = params.toString();
  location.hash = '#/' + (query ? '?' + query : '');
}

function filterDeals(state) {
  const q = state.q.trim().toLowerCase();
  return deals.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (state.cat !== 'All' && d.category !== state.cat) return false;
    if (state.store !== 'All stores' && d.store !== state.store) return false;
    if (state.min > 0 && percentOff(d) < state.min) return false;
    return true;
  });
}

function render() {
  window.__shotReady = false;
  const state = readState();
  if (state.deal) {
    const found = deals.find((d) => d.id === state.deal);
    document.title = `${found ? found.title : 'Not found'} | Bargain Beacon`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = 'Bargain Beacon — Black Friday 2026 deals, checked live';
    const shown = sortDeals(filterDeals(state), state.sort);
    app.innerHTML = listPage(shown, { ...state, total: deals.length }, CATEGORIES, STORES);
    const search = app.querySelector('#q');
    const store = app.querySelector('#store');
    const min = app.querySelector('#min');
    const sort = app.querySelector('#sort');
    search.addEventListener('input', () => writeState({ ...readState(), q: search.value }));
    store.addEventListener('change', () => writeState({ ...readState(), store: store.value }));
    min.addEventListener('change', () => writeState({ ...readState(), min: Number(min.value) }));
    sort.addEventListener('change', () => writeState({ ...readState(), sort: sort.value }));
    app.querySelectorAll('.pill').forEach((pill) => {
      pill.addEventListener('click', () => writeState({ ...readState(), cat: pill.dataset.cat }));
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
