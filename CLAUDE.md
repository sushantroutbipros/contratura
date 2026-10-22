# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Contractura™ is a clickable prototype of a contract-management tool for contractors on Indian PSU works contracts (IOCL Pipelines Division, GCC and the Integrated Works Procedure Manual). The whole app is one self-contained file: `Contractura SCM Prototype.html`. Inline CSS, inline vanilla JS, and the only external dependency is Google Fonts.

There is no build step, package manager, linter or test suite, and the directory is not a git repository. To run it, open the HTML file in a browser.

`react-app/` is a Vite + React wrapper for running the prototype in Docker (`docker compose up -d --build`, port 8080). Its `src/prototype/` files are generated from the HTML by `npm run sync`. Don't edit them by hand. After changing the HTML, re-run the sync. The HTML file stays the source of truth. To verify a change, click through the affected tabs in both themes and at narrow widths. The CSS breakpoints are 980, 860, 700, 560 and 420px.

## File layout

- **Line 1** is a generated document wrapper (doctype, viewport meta, base reset). The authored page starts at `<title>` on line 2.
- **`<style>` block (to ~line 289):** design tokens on `:root`, then component styles.
- **Markup:** one `<section class="screen" id="s-<tab>" role="tabpanel">` per tab. Most content is an empty placeholder (`<div id="...">`, `<tbody id="...">`) that JS fills in.
- **One `<script>`:** a single `"use strict"` IIFE. Section banners look like `/* ---------- bills ---------- */`.

## Script architecture

- **Sample data and constants** come first: contract `C`, `bills`, `hind` (hindrance register), `bgs` (bank guarantees), `finHard`/`finClose`, rate constants (`GST`, `RET`, `MOB`, `TDS`, `PDCAP`…). Values derived from these, such as per-bill deductions, are computed once at load.
- **Mutable demo state** lives in `S`, built by `freshState()`. Derived figures come from `totals()`, `bgState()` and `RCD()` (revised completion date = scheduled date + `S.eot`). Because an EOT changes guarantee validity, dashboard KPIs and so on, state changes usually call `renderAll()`.
- **Rendering:** each screen has a `renderX()` function that builds HTML strings and assigns them to `innerHTML` of placeholder ids. The use-case tools (`ucUpdate`/`ucUpdate2`) and the sub-contractor tab (`renderSubs`) are not reached by `renderAll()`. They re-render from their own handlers.
- **Events** use document-level delegation keyed on `data-*` attributes: `data-go` (switch tab), `data-eot`, `data-fin`, `data-adv`, `data-ucf`, `data-uc`, `data-scst`, `data-scinf`, `data-scchk`. Form inputs are wired by id near the end of the script under `/* ---------- wiring ---------- */`.
- **Navigation:** tabs come from the `TABS` array (`buildTabs()`). `show(id)` toggles `hidden` on `#s-<id>` and writes the URL hash, so tabs deep-link via `#<id>`. To add a tab, add an entry to `TABS` and add a matching `<section id="s-<id>" hidden>`.
- **Use cases** (`UCS`, UC-01 to UC-17) each name a `tool` key. `ucTool(k)` returns that tool's markup, and `ucStatic()`, `ucUpdate()` and `ucUpdate2()` compute its outputs.
- **Sign-in gate:** the `<section class="login">` screen sits before the header. CSS hides `.top`, `.tabs`, `main` and `footer` until the script adds `body.authed`. Any non-empty user ID and password is accepted, since there is no backend. `signIn()` stores the user in `sessionStorage` (`ctr-user`), so a reload in the same tab stays signed in and closing the tab signs out. The app still renders and runs `show(hash)` behind the gate, so deep links like `#bills` open that tab once the user signs in. "Reset demo" does not sign the user out.
- **Sub-contractors:** the M-12 tab has its own state (`SCS`, `SCCHK`) reset by `resetSubs()`. It is kept separate from `S`.

## Conventions and gotchas

- **Write ES5 in the existing compact style:** `var`, `function`, string concatenation, no arrow functions, `let`/`const` or template literals. Pass any user-entered text through `esc()` before it goes into `innerHTML`.
- **Dates** are UTC millisecond timestamps. Use the helpers: `U(y,m,d)`, `P('yyyy-mm-dd')`, `addD`, `addM` (month-end safe), `diff` (whole days), `fD` (display), `iso`. **Money** uses `inr()` (en-IN digit grouping) and `lk()` (₹ L / ₹ Cr).
- **The demo date is fixed** at `TODAY = U(2026,10,17)`. Several `<input type="date">` elements hard-code `max="2026-10-17"`. If the demo date changes, update all of them.
- **Default input values are set in two places:** at init (bottom of the script) and again in the `#resetall` click handler. Keep the two in sync.
- **The dark theme is defined twice:** once under `@media (prefers-color-scheme: dark){:root:not([data-theme="light"])…}` and once under `:root[data-theme="dark"]`. Edit both identically. Dark mode is a different typographic personality (Cormorant Garamond, Marcellus caps, ◆ ornaments via `--pre`/`--orn`), not just a palette swap. The chosen theme is persisted in `localStorage` under `ctr-theme`.
- **`data-theme` has a second, unrelated use:** on `details.uc` elements it is the use-case filter category (`pay`, `delay`, `notice`, `guar`, `sub`). It has nothing to do with the colour theme.
- **Data Dictionary references:** `<span class="ref">M05-014</span>` chips show module or field IDs (`M-01`…`M-11`, 227 fields). `ref prop` marks the proposed M-12. The header toggle hides them via `body.hide-refs`. The Data Dictionary itself is not in this repo, so don't invent new field IDs. Mark unconfirmed ones as proposed, as M-12 does.

## Content rules visible in the copy

- All contract data is sample or anonymised (names, order numbers and sites removed, amounts rounded).
- Legal points that need the contract text or counsel are marked inline as `[to be verified]` or `[to be verified by counsel]`. Keep that practice.
- Generated letters and notices are drafts only. Nothing is "sent" from the UI.
- Clause citations (GCC x.x.x.x, IWPM x.x) appear next to the rules they drive. Keep them accurate when changing a rule or number.
