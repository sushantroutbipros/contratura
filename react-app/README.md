# Contractura SCM: React app

A Vite + React wrapper around `../Contractura SCM Prototype.html`. It renders the same markup, styles and script without changes, so the app looks and behaves exactly like the HTML prototype.

## Run in Docker

```sh
docker compose up -d --build
```

Open http://localhost:8080. Stop it with `docker compose down`.

Without Compose:

```sh
docker build -t contractura-scm .
docker run -d -p 8080:80 --name contractura-scm contractura-scm
```

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Updating from the prototype

`src/prototype/` is generated from the HTML prototype. Don't edit it by hand. After changing the HTML, run:

```sh
npm run sync
```

Then rebuild the image (`docker compose up -d --build`).

The sync script makes one adjustment. The markup is mounted inside `<div id="app">`, so the sign-in gate selectors (`body:not(.authed)>main` and the others like it) are rewritten to `body:not(.authed) #app>main`. The `<head>` (title, viewport, Google Fonts link) lives in `index.html` and is not synced.
