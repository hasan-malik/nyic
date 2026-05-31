# NYIC Reimagined

A React rebuild of the **New York Immigration Coalition** landing page
(originally prototyped in Lovable). Built with Vite + React + TypeScript +
Tailwind CSS.

## Stack

- [Vite](https://vitejs.dev/) — dev server & build
- [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — styling

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

## Structure

```
src/
  App.tsx              # page composition
  components/
    Navbar.tsx         # logo, nav links, Donate button
    Hero.tsx           # headline, copy, CTAs, video placeholder
    GetToKnow.tsx      # "Get to know us" card grid
    Footer.tsx         # subscribe form, contact, Explore links
    Logo.tsx           # NYIC pinwheel mark + wordmark
```

The brand palette (navy, brand red, mist) lives in `tailwind.config.js`.
