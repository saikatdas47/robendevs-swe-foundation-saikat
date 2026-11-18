# Day 04 - Backend Fundamentals

I use JavaScript on Node.js v26 and Express 5 to explore how a backend works.

## [1. Backend Fundamentals](1.%20Backend%20Fundamentals.md)

- **Request handling** — I follow a request from the TCP socket to the Express handler.
- **Processes and threads** — I see how the operating system schedules work.
- **Blocking and non-blocking I/O** — I compare what a thread can do while it waits.
- **Configuration and local secrets** — I load settings from files and environment variables.
- **Dependencies and semantic versioning** — I read package versions, ranges and lockfiles.
- **Errors and logs** — I handle route errors and trace requests with IDs.

## [2. Concurrency, Data Flow, Lifecycle and Memory](2.%20Concurrency%2C%20Data%20Flow%2C%20Lifecycle%20and%20Memory.md)

- **Concurrency models** — I compare thread-per-request, pools, event loops, async/await and lightweight threads.
- **Shared state** — I trace races, locks and deadlocks to understand thread safety.
- **Data flow** — I use streams, buffers and backpressure to control transfer speed.
- **Lifecycle** — I use signals and health checks to stop traffic and drain active requests.
- **Memory** — I follow stack frames, heap objects and garbage collection.

## [3. Workloads, Performance, Resource Limits and Supply Chain](3.%20Workloads%2C%20Performance%2C%20Resource%20Limits%20and%20Supply%20Chain.md)

- **Workload types** — I identify CPU-bound and I/O-bound work and scale each.
- **Performance** — I profile CPU and memory, measure latency under load and reuse connections.
- **Resource limits** — I check file descriptors, connection limits and timeouts across layers.
- **Supply-chain security** — I review dependency risks and scan for known vulnerabilities.

## [4. Research Task](4.%20Research%20Task.md)

- **1,000 concurrent requests** — I compare thread-per-request and event-loop scheduling when one request does heavy CPU work.
