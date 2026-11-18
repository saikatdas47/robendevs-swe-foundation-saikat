# Memory, Metaprogramming, Engine Internals, and Concurrency

I keep these as short idea notes for now. I want to recognize each topic and understand why it matters before going deeper. I run examples separately.

## 1. Memory: garbage collection

JavaScript manages allocation and garbage collection for me. A useful model is reachability: data remains needed by the runtime if it can still be reached through live references. Unreachable objects can become eligible for collection.

```javascript
let user = { name: "Saikat" };
let savedUser = user;
user = null;
console.log(savedUser.name); // Saikat
savedUser = null;
```

Setting `user` to null does not release the object while `savedUser` still references it. After both references are dropped, this example no longer needs the object. That does not guarantee collection at that exact moment.

A cycle alone does not necessarily leak. Modern tracing collectors can collect cycles that are unreachable from live roots.

### Common memory leaks

A leak happens when I unintentionally keep data reachable after I no longer need it.

| What I keep | How unwanted data can stay alive | What I check |
| --- | --- | --- |
| Event listener | Its closure retains data or DOM nodes | Remove the listener when its owner is disposed |
| Repeating timer | Callback retains state and keeps running | Clear the interval |
| Unbounded cache | Entries never get removed | Limit size or expire entries |
| Stored closure | Captured data remains reachable | Drop the callback when finished |
| Detached DOM node | Another reference still points to it | Release stored references too |

Removing a DOM element does not remove every JavaScript reference to it. A closure itself is not a leak; keeping unwanted captured state alive is the issue.

I can compare heap snapshots after repeating the same mount and cleanup cycle. One large heap reading alone does not prove a leak.

### WeakMap and WeakRef

```javascript
const metadata = new WeakMap();
let element = { id: "button" };
metadata.set(element, { clicks: 0 });
console.log(metadata.get(element).clicks); // 0
element = null;
```

For this object key, the WeakMap entry does not keep the key alive by itself. I cannot enumerate WeakMap keys or use it as a normal list of all stored entries.

`WeakRef` lets me hold a weak reference to an object. `reference.deref()` gives the object if still available, or `undefined` after collection. I cannot predict when that happens, so I do not use weak references for correctness-critical ownership or cleanup.

A `FinalizationRegistry` can register eventual cleanup notifications, but callbacks are not guaranteed to run promptly or even before shutdown. Explicit cleanup still matters.

## 2. Metaprogramming: code that changes how operations behave

### Property descriptors

An ordinary property has more rules than just its value.

```javascript
"use strict";
const user = {};
Object.defineProperty(user, "id", {
  value: 101,
  writable: false,
  enumerable: true,
  configurable: false
});
console.log(user.id); // 101
console.log(Object.keys(user)); // ["id"]
// user.id = 202; // TypeError in strict mode
```

`writable` controls assignment to a data property. `enumerable` controls inclusion in operations such as `Object.keys()`. `configurable` controls deletion and most descriptor changes.

For a newly defined property, omitted descriptor flags default to false. An accessor descriptor uses `get` and/or `set` instead of `value` and `writable`.

### Proxy and Reflect

```javascript
const target = { name: "Saikat" };
const user = new Proxy(target, {
  get(target, key, receiver) {
    console.log("Reading " + String(key));
    return Reflect.get(target, key, receiver);
  }
});
console.log(user.name);
// Reading name
// Saikat
```

The proxy intercepts operations performed through it. The `get` trap runs when I read `user.name`. `Reflect.get` forwards the read using ordinary object semantics and preserves the receiver for accessors.

Reflect is a namespace of object-operation methods, not a constructor. Proxy traps must obey language invariants; they cannot freely contradict every rule of their targets. Operating directly on the target bypasses this proxy's interception.

I can recognize uses such as validation, observation and reactive state. I do not need a proxy for every plain object. [MDN Proxy reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), [Reflect reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect).

## 3. Engine internals: a first look at V8

These are engine implementation ideas, not extra JavaScript syntax. Their details can change between V8 versions.

### Hidden classes

V8 tracks object shapes with internal structures often called hidden classes or Maps. Property layout and the order properties are added can affect shape sharing. These Maps are different from JavaScript's `Map` collection. [V8 hidden classes](https://v8.dev/docs/hidden-classes).

```javascript
function createPoint(x, y) {
  return { x, y };
}
const first = createPoint(1, 2);
const second = createPoint(3, 4);
console.log(first.x, second.x); // 1 3
```

Consistently created objects give the engine regular layouts to work with. I cannot prove a hidden-class relationship from this console output alone.

### Inline caches

At a property access such as `point.x`, V8 can use information from previously observed shapes to make later accesses faster. Seeing one or several shapes affects the available fast paths. This feedback is about access patterns, not caching the application-level value forever. [V8 hidden classes and inline caches](https://github.com/v8/v8/blob/main/docs/runtime/hidden-classes-and-ics.md).

### Deoptimisation

An optimizing compiler can generate code based on assumptions about observed values and shapes. If an assumption no longer holds, V8 can leave that optimized code and continue with a more general execution path. That is deoptimisation; it is not a JavaScript exception. [V8 hidden-class optimization example](https://v8.dev/docs/hidden-classes).

I keep code clear and measure real hot paths with profiling. A shape change does not prove a meaningful slowdown in my app, and I do not invent exact timing results from these ideas.

## 4. Concurrency vs parallelism

Concurrency means operations make progress during overlapping periods. Parallelism means work actually executes at the same time.

```text
Concurrency:   start request A → wait
               start request B → wait
               handle results when available

Parallelism:   worker A calculates while worker B calculates
```

One JavaScript agent runs ordinary jobs one at a time. The environment can handle waiting work separately. Workers can run JavaScript on other threads; a browser worker cannot directly manipulate the page's DOM.

Promises do not automatically move CPU-heavy JavaScript to another thread.

### I start independent waits together

```javascript
const wait = value => new Promise(resolve => {
  setTimeout(() => resolve(value), 10);
});

async function run() {
  const first = wait("Dhaka");
  const second = wait("Khulna");
  const cities = await Promise.all([first, second]);
  console.log(cities); // ["Dhaka", "Khulna"]
}
run().catch(error => console.log(error.message));
```

Both waits start before the await. `Promise.all` collects results in input order. It does not itself start these functions, run their callbacks simultaneously, or cancel the other operations if one rejects.

For dependent steps, I await the first result before calling the next operation that needs it.

## 5. Cancellation with AbortController

I can signal that an operation is no longer wanted. The operation must support and respond to that signal.

This browser example needs a real HTTP server endpoint at `/api/weather`:

```javascript
const controller = new AbortController();

async function loadWeather() {
  try {
    const response = await fetch("/api/weather", {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const weather = await response.json();
    console.log(weather);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request cancelled");
    } else {
      console.log(error.message);
    }
  }
}

loadWeather();
controller.abort();
```

This example immediately requests cancellation. In a real page, I might call `abort()` when leaving the view or replacing an outdated search request.

The controller owns the abort operation; its signal is passed to consumers. After a signal is aborted, I create a new controller for a fresh cancellable operation.

Aborting a fetch does not roll back an action the server already performed. It also does not automatically cancel ordinary timers, arbitrary promises or a running synchronous loop. Those need their own cancellation support.

Previous: [Event Loop, Call Stack, Execution Context, and Iteration](EventLoop_CallStack_ExecutionContext_CallbackQueue.md).
