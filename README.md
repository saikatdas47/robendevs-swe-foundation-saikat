# RoBenDevs Foundation Programme

My notes, research tasks and coding assignments for Days 1–7, organised by the folders in this repository.

## Day 1 — Networking, DNS, HTTP/HTTPS and Traffic Routing

| File | What I cover |
| --- | --- |
| [Notes](day-01-networking/notes.md) | IP addressing, TCP/IP, subnetting, DNS, HTTP, TLS, caching, routing and troubleshooting. |
| [Research task · Request path](day-01-networking/request-path.md) | Browser to database and back, with TLS termination and cache points. |
| [Handwritten notes](day-01-networking/Note.pdf) | Networking study notes. |

## Day 2 — Browser Internals, Rendering and Web Security

| File | What I cover |
| --- | --- |
| [Notes](day-02-browser-internals/notes.md) | DOM, CSSOM, events, storage, browser security, DevTools and Web Vitals. Includes why fast requests can still leave a slow page. |
| [Research task · Rendering diagram](day-02-browser-internals/rendering-pipeline.md) | DOM and CSSOM through layout, paint and compositing. Read alongside the last section of the notes. |
| [Handwritten notes](day-02-browser-internals/Note.pdf) | Browser internals study notes. |

## Day 3 — JavaScript in Depth

| File | What I cover |
| --- | --- |
| [Variables, scope, functions, types and modules](day-03-javascript/1.%20Variables_Scope_Functions_Types_Modules.md) | Hoisting, closures, values, equality and ES modules. |
| [Objects, prototypes, inheritance and classes](day-03-javascript/2.%20Objects_Prototypes_Inheritance_Classes.md) | Prototype chains and object construction. |
| [Callbacks, promises and async/await](day-03-javascript/3.%20CallBack_CallbackHell_Promises_AsysncAwait.md) | Asynchronous control flow and error handling. |
| [Event loop and execution context](day-03-javascript/4.%20EventLoop_CallStack_ExecutionContext_CallbackQueue.md) | Call stack, tasks, microtasks and iteration. |
| [Memory and engine internals](day-03-javascript/5.%20Memory_Metaprogramming_EngineInternals_Concurrency.md) | Garbage collection, metaprogramming, V8 and concurrency. |
| [Research task · Execution order and closures](day-03-javascript/research-task.md) | Mixed synchronous code, promises and timers, plus memory retained by a closure. |
| [Practice code](day-03-javascript/JS%20PRACTICE) | JavaScript exercises and examples. |
| [Handwritten notes](day-03-javascript/0.%20HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf) | Callbacks, promises, async/await and the event loop. |

## Day 4 — Backend Fundamentals

| File | What I cover |
| --- | --- |
| [Backend fundamentals](day-04-backend-fundamentals/1.%20Backend%20Fundamentals.md) | HTTP handling, processes, threads, I/O, configuration, dependencies, errors and logs. |
| [Concurrency, data flow, lifecycle and memory](day-04-backend-fundamentals/2.%20Concurrency%2C%20Data%20Flow%2C%20Lifecycle%20and%20Memory.md) | Shared state, streams, backpressure, graceful shutdown and garbage collection. |
| [Workloads, performance, resource limits and supply chain](day-04-backend-fundamentals/3.%20Workloads%2C%20Performance%2C%20Resource%20Limits%20and%20Supply%20Chain.md) | CPU-bound and I/O-bound work, profiling, pooling, timeouts and dependency scanning. |
| [Research task · 1,000 concurrent requests](day-04-backend-fundamentals/4.%20Research%20Task.md) | Thread-per-request and event-loop models under heavy CPU work. |

## Day 5 — Frontend Architecture and System Design

| File | What I cover |
| --- | --- |
| [HTML and CSS fundamentals](day-05-frontend-system-design/1.%20HTML%20and%20CSS%20Fundamentals.md) | Semantic HTML, forms, accessibility, CSS layout, components, data fetching and routing. |
| [State management](day-05-frontend-system-design/2.%20State%20Management.md) | State ownership, CSR, SSR, SSG, ISR and build tooling. |
| [API integration and performance](day-05-frontend-system-design/3.%20API%20Integration%20and%20Performance.md) | REST, GraphQL, pagination, optimistic updates, images, caching and budgets. |
| [Practice designs · Frontend system design](day-05-frontend-system-design/4.%20Frontend%20System%20Design.md) | Requirements, component architecture, real-time data and production concerns. Includes news feed, autocomplete, chat and product page designs. |
| [Coding assignment · React product listing](day-05-frontend-system-design/SEO%20Assignment/README.md) | Two implementations with lazy loading and infinite scroll, one of which also virtualises the list. |
| [Product listing · Infinite scrolling](day-05-frontend-system-design/SEO%20Assignment/SEOAssignment/README.md) | Setup and screenshots for the standard list. |
| [Product listing · Virtualised](day-05-frontend-system-design/SEO%20Assignment/SEOAssignment-Virtualized/README.md) | Setup and screenshots for the windowed list. |

The syllabus asks for one complete frontend design. The practice designs above outline four systems and give me a starting point for that submission.

## Day 6 — Frontend Frameworks

| File | What I cover |
| --- | --- |
| [React and frontend frameworks](day-06-Frontend%20Frameworks%3A%20React/1.%20React%20and%20Frontend%20Frameworks.md) | Components, state, lifecycle and binding across React, Angular, AngularJS, Vue and Svelte. |
| [React Hooks in practice](day-06-Frontend%20Frameworks%3A%20React/2.%20React%20Hooks%20in%20Practice.md) | State, effects, refs, memoisation, reducers, Context and custom Hooks. |
| [Reactivity, routing and debugging](day-06-Frontend%20Frameworks%3A%20React/3.%20Reactivity%2C%20Routing%20and%20Debugging.md) | Update models, routing, data caching, application frameworks and DevTools. |
| [React internals, performance and migration](day-06-Frontend%20Frameworks%3A%20React/4.%20React%20Internals%2C%20Performance%20and%20Migration.md) | Fiber, transitions, Suspense, Server Components, AngularJS migration and framework selection. |

The syllabus asks for framework recommendations for an enterprise admin portal, an SEO-focused content site and an embeddable widget. The framework selection section covers the decision criteria. I have no standalone submission for the three recommendations in this folder.

## Day 7 — Backend Design, APIs and Security

| File | What I cover |
| --- | --- |
| [Backend design, APIs and security](day-07-backend-apis/1.%20Backend%20Design%2C%20APIs%20and%20Security.md) | REST, validation and API layers using Express and JWT. |
| [Authentication, authorisation and API reliability](day-07-backend-apis/2.%20Authentication%2C%20Authorisation%20and%20API%20Reliability.md) | Sessions, tokens, OpenAPI, middleware, safe retries and background jobs. |
| [Architecture, API security and evolution](day-07-backend-apis/3.%20Architecture%2C%20API%20Security%20and%20Evolution.md) | Architecture styles, OWASP API risks, REST, GraphQL, gRPC and contract testing. |
| [Research task · Order service API contracts](day-07-backend-apis/4.%20Research%20Task%20-%20Order%20Service%20API%20Contracts.md) | Authentication, cursor pagination, idempotent payment requests and consistent errors. |

## Presentations

[Presentation folder](presentations/README.md). The syllabus schedules CP-1 after Days 1–3 and CP-2 after Days 4–6. The folder currently contains a README.
