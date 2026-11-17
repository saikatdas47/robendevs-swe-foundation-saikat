# React Product Listing — Two Versions

Two versions of the same product app share the design, API and routes; they differ in how loaded cards are rendered. Both use React, Vite, JavaScript, plain CSS and DummyJSON. Both are client-side rendered (CSR).

## Projects

| Version | Folder / guide | What it does |
| --- | --- | --- |
| Lazy loading + infinite scrolling | [SEOAssignment](SEOAssignment/README.md) | Loads products in batches and keeps every loaded card in the DOM. |
| Lazy loading + infinite scrolling + virtualization | [SEOAssignment-Virtualized](SEOAssignment-Virtualized/README.md) | Loads the same batches, but renders only a moving window of cards near the viewport. |

Each folder has its own README with setup, screenshots and code explanations.

## What is the difference?

- **Lazy loading:** Loads resources when needed. Other card images load near the viewport; detail-page JavaScript loads when its route opens.
- **Infinite scrolling:** Fetches the next products as you approach the bottom. Both versions request two batches of 10, so a normal cycle adds 20 products.
- **Virtualization:** Keeps only a window of loaded cards in the DOM. As you scroll down, earlier off-screen cards unmount while their space is preserved; scrolling back up renders them again.

| After 60 products have loaded | Lazy loading only | With virtualization |
| --- | --- | --- |
| Product objects in React state | 60 | 60 |
| Product cards in the DOM | 60 | Normally about 20 |
| Scroll back to earlier products | Existing cards stay mounted | Cards remount from loaded data |
| Scroll height | All cards determine it | Reserved height keeps the scroll position stable |

A very tall viewport can render more cards; a keyboard-focused card may also stay mounted.

## What improves with virtualization?

A smaller DOM can reduce layout, rendering and DOM memory costs as the list grows. This can help scrolling and interaction on long lists. Downloaded product data remains in memory, so virtualization does not remove all memory usage or reduce the API batch size. It is not SSR.

## Lighthouse performance comparison

| Version | Performance score |
| --- | ---: |
| Lazy loading + infinite scrolling | **94** |
| Lazy loading + infinite scrolling + virtualization | **95** |

These are the reported runs: **a 1-point increase**. The 94 result has a [saved screenshot](SEOAssignment/SS_LightHouse.png); 95 was reported by the project author, with no report attached here yet.

The score difference alone does not prove virtualization caused the increase. Device, network, cache and test settings can affect scores. Virtualization mainly helps after many products have loaded; an initial page-load audit may show only a small difference. Compare both production builds with the same settings, and record a scrolling session in Chrome's Performance panel to assess long-list behavior.

## Run either version

Open a terminal inside the chosen project folder:

```bash
npm ci
npm run dev
```

For a production Lighthouse test:

```bash
npm run build
npm run preview
```

Use the URL printed in the terminal. Stop the server with **Ctrl+C**. See the individual READMEs for details about local shared dependencies and deployment.
