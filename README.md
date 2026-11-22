My notes, research tasks and coding assignments for Days 1–11, organised by the folders in this repository.

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

## Day 8 — Databases

| File | What I cover |
| --- | --- |
| [Relational modelling and SQL](day-08-databases%20/1.%20Relational%20Modelling%20and%20SQL.md) | Tables, keys, constraints, an ER diagram, SELECT, JOIN, GROUP BY, and subqueries. |
| [Normalisation, indexes and migrations](day-08-databases%20/2.%20Normalisation%2C%20Indexes%20and%20Migrations.md) | First to third normal form, denormalisation, index choices, and schema migrations. |
| [Transactions, concurrency and query performance](day-08-databases%20/3.%20Transactions%2C%20Concurrency%20and%20Query%20Performance.md) | ACID, isolation levels, locks, MVCC, deadlocks, EXPLAIN, B-tree and composite indexes, and the N+1 problem. |
| [Database connections and SQL vs NoSQL](day-08-databases%20/4.%20Database%20Connections%20and%20SQL%20vs%20NoSQL.md) | Connection pooling, RDS Proxy, and how to choose among relational, document, key-value, and wide-column stores. |
| [Replication, high availability and database scaling](day-08-databases%20/5.%20Replication%2C%20High%20Availability%20and%20Database%20Scaling.md) | WAL, replica lag, Multi-AZ, PITR, partitioning, sharding, Redis cache-aside, vacuum, and optimiser statistics. |
| [PostgreSQL tutorial](day-08-databases%20/6.%20PostgreSQL%20Tutorial.md) | A hands-on shop database with psql, SQL queries, transactions, views, query plans, and backup and restore. |

## Day 9 — SaaS and Multi-Tenancy

| File | What I cover |
| --- | --- |
| [SaaS foundations, tenant identity and billing](day-09-saas-multitenancy/1.%20SaaS%20Foundations%2C%20Tenant%20Identity%20and%20Billing.md) | Cloud service models, tenant identity and data models, plans, trials, and subscriptions. |
| [Tenant isolation, onboarding and governance](day-09-saas-multitenancy/2.%20Tenant%20Isolation%2C%20Onboarding%20and%20Governance.md) | Authorisation, caching and jobs, domains and TLS, configuration, limits, metering, and data governance. |
| [Scaling and operating a SaaS platform](day-09-saas-multitenancy/3.%20Scaling%20and%20Operating%20a%20SaaS%20Platform.md) | Noisy neighbours, tenant costs and migrations, control and data planes, sharding, and enterprise isolation. |
| [Commerce SaaS research task](day-09-saas-multitenancy/Research%20Task%20-%20Commerce%20SaaS%20for%201000%20Merchants.md) | A concept design for 1,000 merchants with a tenant model and data-leakage comparison. |

## Day 10 — System Design

| File | What I cover |
| --- | --- |
| [System Design Foundations](day-10-system-design/1.%20System%20Design%20Foundations.md) | Requirements, rough estimates, scaling, building blocks, architecture styles, and caching. |
| [Messaging, Resilience and Service Data](day-10-system-design/2.%20Messaging%2C%20Resilience%20and%20Service%20Data.md) | Sync and async calls, queue and stream tools, resilience, and data ownership. |
| [Practice System Designs](day-10-system-design/3.%20Practice%20System%20Designs.md) | URL shortener, rate limiter, notification service, and ride matching. |
| [Consistency, Transactions and Infrastructure](day-10-system-design/4.%20Consistency%2C%20Transactions%20and%20Infrastructure.md) | CAP, PACELC, sagas, outbox and inbox, discovery, mesh, tracing, and queueing. |
| [Real-World Architecture Decisions](day-10-system-design/5.%20Real-World%20Architecture%20Decisions.md) | Architecture decisions at Uber, Grab, Shopify, Discord, Segment, and Prime Video. |

## Day 11 — SDLC and Git

| File | What I cover |
| --- | --- |
| [SDLC, Agile and Requirements](day-11-sdlc-git/1.%20SDLC%2C%20Agile%20and%20Requirements.md) | SDLC, Agile, Scrum, Kanban, user stories, acceptance criteria, and Jira. |
| [Git Workflow and History](day-11-sdlc-git/2.%20Git%20Workflow%20and%20History.md) | Branch and pull request workflow, trunk-based development, GitFlow, history commands, and commit quality. |
| [Team Review and Testing](day-11-sdlc-git/3.%20Team%20Review%20and%20Testing.md) | Readiness and completion standards, code review, a PR template, and the testing pyramid. |
| [Git Internals, Releases and Delivery](day-11-sdlc-git/4.%20Git%20Internals%2C%20Releases%20and%20Delivery.md) | Git objects and refs, reflog and bisect, releases, ADRs, incident reviews, DORA, and secure delivery. |

## Presentations

[Presentation folder](presentations/README.md). The syllabus schedules CP-1 after Days 1–3 and CP-2 after Days 4–6. The folder currently contains a README.

## Production Software Engineering with AI-Assisted Development

AI can help me write code. I am responsible for understanding the system, securing it, deploying it, and keeping it reliable in production. These are the questions I want to be able to answer before and after I ship an application.

| Area | Questions I ask | Topics I study |
| --- | --- | --- |
| **1. Databases** | Where do I store the data, and how do I organise it? | SQL vs. NoSQL, PostgreSQL, MongoDB, schema design, indexes, transactions, normalisation, connection pooling, read replicas, and sharding. |
| **2. Encryption** | How do I protect data in transit and at rest? | HTTPS and TLS, encryption in transit, encryption at rest, password hashing, bcrypt and Argon2, AES, public and private keys, SSL/TLS certificates, key management services (KMS), and encrypted backups. |
| **3. Authentication and authorisation** | How do I decide who can sign in and what they can do? | Sessions and cookies, JWTs, refresh tokens, OAuth 2.0, Google and GitHub sign-in, role-based access, permissions, two-factor authentication, password reset flows, and login rate limits. |
| **4. Secrets management** | How do I check whether I have exposed API keys or other secrets? | Environment variables, keeping `.env` files out of Git, secrets managers, making API calls from the server, keeping secret keys out of frontend code, key rotation, least privilege, leaks in Git history, secret scanning, and webhook signatures. |
| **5. Security** | How do I protect my application against SQL injection and other common web vulnerabilities? | SQL injection prevention, parameterised queries, input validation, cross-site scripting (XSS), cross-site request forgery (CSRF), cross-origin resource sharing (CORS), security headers, the OWASP Top 10, dependency audits, and penetration testing. |
| **6. Networking** | How does a request reach my server? | DNS, IP addresses, TCP and UDP, HTTP and HTTPS, ports, reverse proxies, and Nginx. |
| **7. System design** | How do the parts of my system fit together, and what trade-offs did I make? | Client–server architecture, monoliths vs. microservices, API design, REST and GraphQL, caching strategies, the CAP theorem, consistency, event-driven design, publish/subscribe messaging, and architectural trade-offs. |
| **8. Scaling** | How would my system handle 10,000 users arriving at once? | Load balancers, horizontal scaling, stateless servers, Redis caching, content delivery networks (CDNs), message queues, background workers, autoscaling, database scaling, and rate limiting. |
| **9. Load testing** | How do I test my system under expected, sustained, and sudden load? | Load testing, stress testing, spike testing, k6, JMeter, p95 and p99 latency, throughput, bottleneck identification, profiling, and benchmarks. |
| **10. Software testing** | How would I catch a bug introduced by an AI-generated change? | Unit tests, integration tests, end-to-end tests, Playwright, mocks, test coverage, test-driven development (TDD), regression tests, tests in continuous integration (CI), and code review. |
| **11. Deployment** | How do I get my application from my machine to production? | Docker, CI/CD, GitHub Actions, AWS, Kubernetes, environment-specific configuration, and custom domains. |
| **12. Disaster recovery** | How would I restore service and data after a failure? | Automated backups, point-in-time recovery, restore drills, snapshots, replication, failover, multi-region architecture, recovery point objectives (RPOs), recovery time objectives (RTOs), recovery plans, and data retention. |
| **13. Monitoring** | How will I know my system is failing before users report it? | Logging, error tracking, Sentry, metrics, dashboards, alerts, uptime checks, health checks, distributed tracing, and incident postmortems. |

Adapted from [Himanshu Raj Singour’s Facebook reel](https://www.facebook.com/reel/1167953322231996).

