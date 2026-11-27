# Bargain Beacon — Black Friday 2026 deal finder

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/cocik17/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/cocik17/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A static deal finder for Black Friday 2026: real deals found and checked live on Friday 27 November 2026, each with its product, store, sale price, usual price, discount, store link, check time, and an honest verdict on whether it is really a deal. Search and filters by category, store and discount work; deals are sorted best-first by deal score, and the same product is compared across stores where it is sold at more than one.

Bounty: [black-friday-deal-finder-01 on make.fun](https://make.fun/bounty/black-friday-deal-finder-01)

Built with [make.fun](https://make.fun/r/ydyxtegc) — referral code `ydyxtegc`.

## Run it

Serve `app/` with any static server (for example `node serve.ts`) and open `http://localhost:8080`. No build step, no network requests: the deals live in `app/data.js`.

## Layout

- `app/index.html` — page shell
- `app/main.js` — routing, filters, sorting, rendering
- `app/views.js` — HTML for the list and the deal page
- `app/score.js` — deal score and verdict labels
- `app/data.js` — the deals, each with store link, prices, check time and source
- `app/style.css` — the whole look
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — renders of the site in a browser
