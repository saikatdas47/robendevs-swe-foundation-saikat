# Event Loop, Call Stack, Execution Context, Callback Queue, and Iteration

I use the same examples from my simulations. First I follow an ordinary function call. Then I add a timer and a promise. Then I follow three timer callbacks from registration to execution, compare tasks with microtasks, and learn how iterators and generators produce values.

I use a browser classic script as my learning model unless I mention Node.js. The diagrams show simplified checkpoints, not every internal engine operation. I run each example separately.

## 1. What each part does

| Part | How I understand it |
| --- | --- |
| Global Execution Context (GEC) | The environment used to execute my top-level script |
| Function Execution Context (FEC) | A new execution context for a function invocation |
| Memory / scope | The bindings and values my code can access |
| Call stack | Tracks the currently active calls; the top call runs first |
| Browser timer system | Tracks timer delays and keeps the registered callback available |
| Task queue / callback queue | Holds tasks whose callbacks can run when selected |
| Microtask queue | Holds promise reactions, await continuations and other microtasks |
| Event loop | Coordinates tasks, microtask checkpoints and rendering opportunities |

A browser can have multiple task queues. I draw one timer task queue to keep these examples easy. I do not treat every browser event as sharing one universal FIFO queue.

## 2. My first execution-context example

```javascript
let score = 10;

function addOne(n) {
  const result = n + 1;
  return result;
}

console.log("start");
score = addOne(score);
console.log("end", score);
```

Output:

```text
start
end 11
```

### Step 1: The global context is set up

For learning, I separate setup from executing statements. The actual engine can implement these operations differently.

Before the first statement executes:

```text
Call stack, top first       Global scope
┌──────────────────┐       score  → uninitialized (TDZ)
│ GEC              │       addOne → function object
└──────────────────┘
```

The `let` binding exists, but I cannot read it yet. It is not initialized to `undefined`. The time before initialization is its Temporal Dead Zone.

The function declaration is already initialized. Its body does not execute just because the declaration is available.

### Step 2: I initialize score

```javascript
let score = 10;
```

Now the global `score` binding has the value `10`.

### Step 3: I print start

While `console.log("start")` runs, I picture the active call above the global context:

```text
TOP → console.log("start")
      GEC
```

It prints `start` and returns. That call leaves the stack.

### Step 4: I call addOne(score)

JavaScript evaluates the argument `score`, which is `10`, then calls `addOne` with that value. This invocation gets its own Function Execution Context.

```text
Call stack                 Scope / bindings
┌──────────────────┐      Global: score = 10
│ addOne FEC       │      Global: addOne → function object
├──────────────────┤
│ GEC              │      Local: n = 10
└──────────────────┘      Local: result = uninitialized (TDZ)
```

The parameter `n` receives the argument value. `result` is local to this call.

### Step 5: I calculate result

```javascript
const result = n + 1;
```

`result` is initialized to `11`. The global `score` is still `10` at this checkpoint. I have not returned and completed the assignment yet.

### Step 6: I return and assign

```javascript
return result;
```

The function returns `11`. Its execution context leaves the active call stack. The caller resumes and finishes this statement:

```javascript
score = addOne(score);
```

Now global `score` becomes `11`.

```text
TOP → GEC

Global: score = 11
```

A function context leaving the stack does not mean every value it used is instantly deleted. Reachable data can remain, for example through a closure.

### Step 7: I finish the script

`console.log("end", score)` prints `end 11`. After top-level execution finishes, its execution context leaves the active stack. This does not automatically erase global bindings.

My stack is LIFO: Last In, First Out. The latest active call finishes before execution returns to its caller.

## 3. I add a timer and a promise

This is the complete example from the first simulation:

```javascript
let score = 10;

function addOne(n) {
  const result = n + 1;
  return result;
}

console.log("start");
score = addOne(score);

setTimeout(function cb() {
  console.log("timer", score);
}, 0);

Promise.resolve().then(function done() {
  console.log("promise", score);
});

console.log("end", score);
```

Output:

```text
start
end 11
promise 11
timer 11
```

The ordinary function steps are the same as before. I now follow what happens after `score` becomes `11`.

### Step 8: I register cb with the timer system

When execution reaches the function expression, the callback function object is created. `setTimeout` registers that function with the timer system and returns.

```text
Call stack                 Browser timers
setTimeout(...)            cb reference, delay 0 ms
GEC
```

I keep three separate events in mind:

1. The callback function object is created.
2. The timer is registered.
3. Later, the callback is actually called.

The callback's execution context is created for the invocation in step 3, not while the timer is waiting.

`cb` is the name of a function expression here. It does not create a global `cb` declaration.

### Step 9: setTimeout returns

```text
Call stack                 Browser / timer work
GEC                        cb scheduled for a later task
```

The callback does not sit on the call stack during the delay. `0` does not mean it interrupts the current script. The environment may also apply minimum timer delays.

### Step 10: I register the promise handler

`Promise.resolve()` gives an already fulfilled promise in this example. Calling `.then(done)` queues its fulfillment reaction as a microtask.

```text
Call stack       Timer work                  Microtask queue
GEC              cb scheduled for later      done
```

The handler does not run immediately, even though this promise is already fulfilled.

### Step 11: I print end 11

The current synchronous script continues:

```javascript
console.log("end", score);
```

Output so far:

```text
start
end 11
```

### Step 12: The current script finishes

Its execution context leaves the active call stack. The runtime can process the microtask checkpoint.

```text
Call stack       Timer work                  Microtask queue
Empty            cb scheduled for later      done
```

### Step 13: The promise handler runs

The promise reaction invokes `done`. This invocation has its own Function Execution Context. It reads the outer global `score` binding, whose value is `11`.

```text
TOP → console.log("promise", score)
      done FEC
```

It prints `promise 11`. The log call returns, then `done` finishes and leaves the stack.

If a microtask adds another microtask, that new one is also processed before this checkpoint finishes. A long chain of microtasks can delay timer tasks and rendering.

### Step 14: The timer callback gets its turn

The event loop can select the eligible timer task after the current work and microtask checkpoint. The timer task invokes `cb`.

```text
TOP → console.log("timer", score)
      cb FEC
```

It reads `score`, prints `timer 11`, and finishes. The callback's execution context leaves the stack.

I do not imagine the event loop copying the callback's source code onto the stack. The runtime calls the function; that invocation has an execution context tracked by the stack.

### My checkpoints together

| Checkpoint | Active stack, top first | Waiting work | Output added |
| --- | --- | --- | --- |
| Print start | log → GEC | None | start |
| Call addOne | addOne → GEC | None | None |
| Return 11 | GEC | None | None |
| Register timer | setTimeout → GEC | cb timer | None |
| Register promise handler | GEC | cb timer; done microtask | None |
| Print end | log → GEC | cb timer; done microtask | end 11 |
| Script finished | Empty | cb timer; done microtask | None |
| Run microtask | log → done | cb timer | promise 11 |
| Run timer task | log → cb | None in this example | timer 11 |

## 4. Three callbacks: browser timer to queue to stack

This is the second simulation example:

```javascript
console.log("start");

setTimeout(function cb1() {
  console.log("one");
}, 1000);

setTimeout(function cb2() {
  console.log("two");
}, 2000);

setTimeout(function cb3() {
  console.log("three");
}, 3000);

console.log("end");
```

Expected output for this simple example:

```text
start
end
one
two
three
```

### First, the script registers all three timers

`start` prints. Then the three `setTimeout` calls register three separate callbacks. Each call returns without waiting for its callback.

```text
Browser timer system
cb1 → requested delay 1000 ms
cb2 → requested delay 2000 ms
cb3 → requested delay 3000 ms

Call stack: GEC
Timer task queue: empty at this initial checkpoint
```

Each delay is counted from its own timer registration. The registrations happen close together here, but not literally at the same instant.

The browser retains references to the functions I passed. It does not create a new callback instance every time it checks a timer. Each callback invocation later gets its own execution context.

`end` prints before any of these timer callbacks. The current script then finishes.

### Around 1 second: cb1 becomes eligible

For this walkthrough, I assume the page is not busy and the timers become eligible in the expected order. The times are approximate.

```text
Browser timers           Timer task queue       Call stack
cb2 pending              FRONT → cb1             Empty
cb3 pending
```

The timer's task is ready. That does not mean its JavaScript body has already run.

The event loop can select the timer task. The task invokes `cb1`:

```text
Browser timers           Timer task queue       Call stack, top first
cb2 pending              Empty                  console.log("one")
cb3 pending                                     cb1 FEC
```

`one` prints. The log call returns, then `cb1` finishes. A microtask checkpoint follows the task; this example has no microtasks to run.

### Around 2 seconds: cb2 follows the same path

```text
cb2 delay passes
       ↓
cb2 timer task is queued
       ↓
event loop selects that task when possible
       ↓
cb2 is invoked → cb2 FEC → console.log("two")
       ↓
two prints → calls finish → stack empty
```

### Around 3 seconds: cb3 follows

```text
cb3 delay passes → timer task queue → selected task → cb3 invocation
                                                         ↓
                                                   prints three
```

After it finishes, there are no pending timers from this example.

I can remember the route like this:

```text
Register callback with browser timer
                   ↓
Requested delay passes
                   ↓
Timer task becomes ready in a task queue
                   ↓
Event loop selects the task when allowed
                   ↓
Task calls the callback
                   ↓
Callback's execution context goes on the call stack
                   ↓
Callback finishes; context leaves the stack
```

## 5. What if JavaScript is still busy?

Suppose synchronous work keeps the current task busy until all three timers are eligible. They cannot interrupt that work.

At a simplified checkpoint, I might draw:

```text
Call stack                    Timer task queue
busyFunction                  FRONT → cb1 → cb2 → cb3
GEC
```

After the current task finishes and its microtasks are processed, the browser can run a timer task. It does not move all three callbacks onto the call stack together.

```text
Run cb1 → finish → microtask checkpoint
Run cb2 → finish → microtask checkpoint
Run cb3 → finish → microtask checkpoint
```

This diagram assumes these timer tasks are queued in that order. Other browser work and task sources can also affect scheduling.

## 6. What I mean by repeated checking

I picture the event loop asking:

```text
Is the current task finished?
          ↓
Process the microtask checkpoint
          ↓
Can a runnable task be selected?
          ↓
Run one selected task
          ↓
Continue the event-loop cycle
```

This is a learning model, not a `while (true)` loop I should write in my code. A busy polling loop would block the very callbacks I want to run.

The browser can also take rendering opportunities. I do not assume it must render after every task or continuously burn CPU when there is no work.

## 7. Tasks vs microtasks: how I decide the execution order

I keep two types of waiting work separate.

| Work | Where I track it |
| --- | --- |
| A timer callback after its delay | A task queue |
| Browser-dispatched events, such as a user click | Tasks from the relevant task source |
| A fulfilled promise's `.then()` handler | Microtask queue |
| A rejected promise's rejection handler | Microtask queue |
| `queueMicrotask(callback)` | Microtask queue |
| An async function's continuation after `await` | Resumes through promise jobs / microtasks |

Calling a normal function still runs it immediately. A promise executor also runs immediately. I do not put everything related to promises into the microtask queue.

My basic browser sequence is:

```text
Run the current task's synchronous code
                  ↓
Process microtasks until the queue is empty
                  ↓
Browser may take a rendering opportunity
                  ↓
Select another runnable task
                  ↓
Repeat
```

This is a simplified cycle. Microtask checkpoints can also happen at other defined points. I use it to trace these standalone script examples, not as a complete browser specification.

### I mix synchronous code, a promise and two timers

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);

Promise.resolve().then(() => {
  console.log("D");
  queueMicrotask(() => console.log("E"));
});

setTimeout(() => console.log("F"), 0);
console.log("G");
```

Output:

```text
A
G
D
E
B
C
F
```

1. I print `A`, register the first timer, queue the `D` promise handler, register the second timer, then print `G`.
2. The script finishes. The microtask checkpoint starts.
3. The first microtask prints `D` and queues another microtask for `E`.
4. The checkpoint keeps going, so `E` prints before either timer callback.
5. The first timer task prints `B` and queues the promise handler for `C`.
6. At the next microtask checkpoint, `C` prints.
7. The second timer task prints `F`.

```text
After script:       microtasks [D]      timer callbacks [B, F]
While D runs:       microtasks [E]      timer callbacks [B, F]
After checkpoint:   microtasks []       timer callbacks [B, F]
While B runs:       microtasks [C]      remaining timer [F]
After checkpoint:   microtasks []       remaining timer [F]
```

I do not drain every timer callback before checking microtasks again. A microtask queued inside the first timer runs before the second timer task in this example.

### I add await to the order

```javascript
console.log("start");

async function run() {
  console.log("inside");
  await Promise.resolve();
  console.log("after await");
}

run();
Promise.resolve().then(() => console.log("then"));
console.log("end");
```

Output:

```text
start
inside
end
after await
then
```

`run()` starts immediately and prints `inside`. Its `await` schedules a continuation, even though the promise is already fulfilled. The caller then queues the `then` handler and prints `end`.

At the checkpoint, the already queued await continuation runs before that later handler. I track when a microtask gets queued, not just whether its code uses `await` or `.then()`.

If I recursively keep adding microtasks, I can keep the checkpoint busy and delay tasks and rendering. Microtasks do not interrupt currently running synchronous code.

## 8. My practice uses very close timer delays

In my current practice file, I use `1000`, `999`, and `2000` milliseconds. I also try fractional values close to `1000`.

I do not use a one-millisecond difference to prove a universal callback order. The timers start at separate registrations, timer precision is limited, and the runtime can normalize delays. Very long decimal literals can also round to the same Number value.

For understanding the basic journey, the simulation's `1000`, `2000`, and `3000` delays make the difference easier to see. For an actual dependency, I use chaining or `await` rather than guessing from tiny timer differences.

Node.js provides its own timers and event loop; it does not use a browser timer system. The same basic lesson still helps: a timer delay is not a promise of an exact execution time, and callbacks cannot interrupt the current synchronous work.

## 9. Memory is different from the active stack

In these notes, my memory panel means accessible bindings and values. It is not a literal map of RAM.

- I think of function and object values as living in managed memory, often illustrated as the heap. The engine can optimize their actual storage.
- An execution context tracks the environment of an invocation. A local binding and a global binding are not the same thing.
- A callback can remain reachable through the runtime while waiting, even when its function is not running.
- When a context leaves the stack, reachable captured values can remain alive.
- Unreachable objects become eligible for garbage collection. Collection does not have to happen immediately.

For `let` and `const`, I mark the binding as uninitialized before its declaration runs. For a `var` binding, setup normally initializes it to `undefined`. I do not label every kind of declaration `undefined` in the memory diagram.

## 10. Iteration: I take one value at a time

The event loop explains when work runs. Iteration explains how I visit values. These are related to execution, but they are different ideas: an ordinary iterator does not need a timer, a promise or an event-loop turn.

### Iterable vs iterator

An iterable provides a method at `Symbol.iterator`. Calling that method gives an iterator. The iterator has a `next()` method that returns an object describing the next step.

```javascript
const cities = ["Dhaka", "Chittagong", "Khulna"];
const iterator = cities[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

The results contain:

```text
{ value: "Dhaka", done: false }
{ value: "Chittagong", done: false }
{ value: "Khulna", done: false }
{ value: undefined, done: true }
```

I read `done: false` as a value being available from this step. `done: true` means this iterator has finished. After it finishes, this array iterator does not restart on its own. I ask the array for a new iterator if I want to start again.

### for...of handles next() for me

```javascript
const cities = ["Dhaka", "Chittagong", "Khulna"];

for (const city of cities) {
  console.log(city);
}
```

Output:

```text
Dhaka
Chittagong
Khulna
```

The loop gets an iterator, requests values and stops when it receives a completed result. Arrays and strings are iterable. An ordinary object literal is not automatically iterable. I can use `Object.entries(object)` to get an array of its own enumerable string-keyed entries and iterate that array.

### I make my own iterable

```javascript
const numbers = {
  [Symbol.iterator]() {
    let current = 1;

    return {
      next() {
        if (current <= 3) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

console.log([...numbers]); // [1, 2, 3]
console.log([...numbers]); // [1, 2, 3]
```

Each call to `numbers[Symbol.iterator]()` creates a fresh `current` binding. That is why these two spreads can both start from `1`.

## 11. Generators: I write a pausable iterator

A generator function uses `function*`. Calling it returns a generator object. The body waits until I request its first step with `next()`.

```javascript
function* citySteps() {
  console.log("Generator started");
  yield "Dhaka";
  yield "Chittagong";
  return "Finished";
}

const iterator = citySteps();
console.log("Created");
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

Output values:

```text
Created
Generator started
{ value: "Dhaka", done: false }
{ value: "Chittagong", done: false }
{ value: "Finished", done: true }
{ value: undefined, done: true }
```

1. `citySteps()` creates the generator object without executing the body.
2. The first `next()` starts the body, prints the message and reaches the first `yield`.
3. `yield` provides `"Dhaka"` and suspends the generator.
4. The second `next()` resumes after that yield and reaches the next one.
5. The third `next()` reaches `return`, so the generator completes with `done: true`.
6. Another `next()` does not restart it.

```text
citySteps() → generator object, suspended before body
next()      → run → yield Dhaka → suspend
next()      → resume → yield Chittagong → suspend
next()      → resume → return Finished → complete
```

A generator object is both an iterator and an iterable. I can use it with `for...of`, but that loop ignores the completion value returned with `done: true`.

```javascript
function* cities() {
  yield "Dhaka";
  yield "Khulna";
  return "Finished";
}

console.log([...cities()]); // ["Dhaka", "Khulna"]
```

`"Finished"` is not included because I returned it instead of yielding it.

### A generator keeps its local progress

```javascript
function* countToThree() {
  for (let number = 1; number <= 3; number++) {
    yield number;
  }
}

const counter = countToThree();
console.log(counter.next().value); // 1
console.log(counter.next().value); // 2
console.log(counter.next().value); // 3
console.log(counter.next().done); // true
```

The generator retains its state between requests. While suspended, it is not an actively running frame blocking the call stack. Calling `next()` resumes it synchronously until it yields, returns or throws.

If I put a huge calculation before a yield, that calculation can still block JavaScript. A generator is not automatically asynchronous and does not automatically give the browser a rendering turn.

### yield is different from await

| Question | yield in a normal generator | await in an async function |
| --- | --- | --- |
| Why does it pause? | To provide a value and wait for another request | To continue after an awaited result is available |
| What resumes it normally? | The caller invokes `next()` | Promise settlement schedules the continuation |
| What does the function call return? | A generator object | A promise |
| Does it automatically run work in parallel? | No | No |

### I connect a generator back to execution order

```javascript
function* steps() {
  console.log("generator body");
  yield "first value";
  console.log("generator resumed");
}

const iterator = steps();
console.log("start");
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("microtask"));

console.log(iterator.next().value);
console.log("between calls");
iterator.next();
console.log("end");
```

Output:

```text
start
generator body
first value
between calls
generator resumed
end
microtask
timer
```

Both `next()` calls happen during the current script. Each resumes the generator immediately. Its yield returns control to the caller; it does not make the pending promise handler run in between these lines.

After the script finishes, the microtask runs. The timer task gets its turn later. I can now separate two questions: **who requests the next value, and when does the runtime execute queued work?**

## How I trace an example myself

1. I mark synchronous statements and follow ordinary function calls.
2. I update bindings only when the relevant initialization or assignment happens.
3. I register timers when execution reaches their calls.
4. I keep promise reactions in the microtask queue, separate from timer tasks.
5. I finish the current task, then process its microtask checkpoint.
6. I select later tasks and trace each callback invocation separately.
7. I record output only when a `console.log` actually executes.

My short reminder is: **registered is not running, eligible is not executing, and a callback waiting outside the stack is not blocking the next line.**

Related note: [Callbacks, Callback Hell, Promises, and Async/Await](CallBack_CallbackHell_Promises_AsysncAwait.md).

## My references

- My handwritten notes: [pages 5-9](HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf).
- My timer practice: [1.js](JS%20PRACTICE/EventLoop%2CCallBack%20Queue%2C%20Call%20Stack/1.js).
- My mixed timer and file-write practice: [1.js](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/1.js).
- Book: [JavaScript from Beginner to Professional](JSBook.pdf), Chapter 13, event loop section, pages 355-358.
