// HTML for each page, built from the deal data. Every value is escaped before it
// goes into the page, so a deal's own text can never break the layout.

import { dealScore, percentOff, verdictClass, verdictLabel } from './score.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${n.toLocaleString('en-US')}`;
const day = (iso) =>
  new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

export function dealCard(deal) {
  return `<li class="card">
  <div class="card-top"><span class="store">${escape(deal.store)}</span><span class="cat">${escape(deal.category)}</span></div>
  <h2><a href="#/deal/${encodeURIComponent(deal.id)}">${escape(deal.title)}</a></h2>
  <div class="price-row"><span class="sale">${usd(deal.price)}</span><s class="was">${usd(deal.was)}</s><span class="off">${percentOff(deal)}% off</span></div>
  <div class="score-row"><span class="score">Deal score ${dealScore(deal)}/100</span><span class="verdict ${verdictClass(deal)}">${verdictLabel(deal)}</span></div>
  <p class="evidence">${escape(deal.evidence)}</p>
  <p class="checked">Checked ${day(deal.checked)} &middot; ${escape(deal.source)}</p>
  <a class="store-link" href="${escape(deal.url)}" rel="noopener">View at ${escape(deal.store)} &rarr;</a>
</li>`;
}

export function listPage(deals, state, categories, stores) {
  const pills = ['All', ...categories]
    .map(
      (c) =>
        `<button class="pill${state.cat === c ? ' on' : ''}" data-cat="${escape(c)}">${escape(c)}</button>`,
    )
    .join('');
  const storeOptions = ['All stores', ...stores]
    .map((s) => `<option${state.store === s ? ' selected' : ''}>${escape(s)}</option>`)
    .join('');
  const minOptions = [0, 20, 30, 40, 50]
    .map(
      (m) =>
        `<option value="${m}"${state.min === m ? ' selected' : ''}>${m === 0 ? 'Any discount' : m + '% off or more'}</option>`,
    )
    .join('');
  const sortOptions = [
    ['score', 'Best score first'],
    ['discount', 'Biggest discount'],
    ['price-low', 'Lowest price'],
    ['price-high', 'Highest price'],
  ]
    .map(([v, l]) => `<option value="${v}"${state.sort === v ? ' selected' : ''}>${l}</option>`)
    .join('');
  const rows = deals.map(dealCard).join('');
  return `<h1>Black Friday deals, checked live</h1>
<p class="lede">${deals.length} deals below, best score first. Every price was read at the store or in a deals source that names the store, on Friday 27 November 2026.</p>
<div class="filters">
  <div class="search-row">
    <input type="search" id="q" placeholder="Search deals, stores, products&hellip;" value="${escape(state.q)}" aria-label="Search deals">
    <select id="store" aria-label="Filter by store">${storeOptions}</select>
    <select id="min" aria-label="Filter by discount">${minOptions}</select>
    <select id="sort" aria-label="Sort deals">${sortOptions}</select>
  </div>
  <div class="pills" id="pills">${pills}</div>
  <p class="count-line">Showing ${deals.length} of ${state.total} deals${state.q ? ` for &ldquo;${escape(state.q)}&rdquo;` : ''}${state.cat !== 'All' ? ` in ${escape(state.cat)}` : ''}${state.store !== 'All stores' ? ` at ${escape(state.store)}` : ''}${state.min > 0 ? `, ${state.min}% off or more` : ''}</p>
</div>
${deals.length === 0 ? '<p class="empty">No deal matches those filters. Clear the search or pick another category.</p>' : `<ul class="deals">${rows}</ul>`}`;
}

export function compareTable(deal) {
  if (!deal.compare || deal.compare.length === 0) return '';
  const rows = deal.compare
    .map(
      (c) =>
        `<tr><td>${escape(c.store)}</td><td>${usd(c.price)}</td><td>${c.price === deal.price ? '<span class="best">Best price here</span>' : `<a href="${escape(c.url)}" rel="noopener">View at ${escape(c.store)}</a>`}</td></tr>`,
    )
    .join('');
  return `<section class="compare"><h2>Same product at other stores</h2>
<table><thead><tr><th>Store</th><th>Price</th><th>Link</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

export function dealPage(deal) {
  return `<p><a class="back" href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escape(deal.store)}</span><span class="cat">${escape(deal.category)}</span></div>
  <h1>${escape(deal.title)}</h1>
  <div class="price-row"><span class="sale">${usd(deal.price)}</span><s class="was">${usd(deal.was)}</s><span class="off">${percentOff(deal)}% off</span></div>
  <div class="score-row"><span class="score">Deal score ${dealScore(deal)}/100</span><span class="verdict ${verdictClass(deal)}">${verdictLabel(deal)}</span></div>
  <p class="evidence">${escape(deal.evidence)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(deal.store)}</dd>
    <dt>Category</dt><dd>${escape(deal.category)}</dd>
    <dt>Sale price</dt><dd>${usd(deal.price)}</dd>
    <dt>Usual price</dt><dd>${usd(deal.was)}</dd>
    <dt>Discount</dt><dd>${percentOff(deal)}% off &mdash; you save ${usd(deal.was - deal.price)}</dd>
    <dt>Checked</dt><dd>${day(deal.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(deal.source)}</dd>
  </dl>
  <p><a class="store-link" href="${escape(deal.url)}" rel="noopener">Buy it at ${escape(deal.store)} &rarr;</a></p>
  ${compareTable(deal)}
  ${deal.note ? `<p class="note">${escape(deal.note)}</p>` : ''}
</article>`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
