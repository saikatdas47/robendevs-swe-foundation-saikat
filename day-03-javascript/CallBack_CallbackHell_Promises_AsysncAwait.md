# Callbacks, Callback Hell, Promises, and Async/Await

I follow my practice in this order: callbacks, nested callbacks, promise chains, then async and await. Each example runs separately unless I say it uses a function from above.


## Callback

I start with my calculator example. Before thinking about timers or APIs, I want to understand what I am actually passing to a function.

### I pass a function as an argument

```javascript
function sum(a, b) {
  console.log("The sum of a and b is: " + (a + b));
}

function multiply(a, b) {
  console.log("The product of a and b is: " + (a * b));
}

function calculator(a, b, operation) {
  operation(a, b);
}

calculator(5, 10, sum);
calculator(5, 10, multiply);
```

Output:

```text
The sum of a and b is: 15
The product of a and b is: 50
```

Here, `sum` and `multiply` are callbacks because I pass them to another function for that function to call. `operation` is just a parameter name. I could name it `callback` too.

For the first call, I follow these steps:

1. I call `calculator(5, 10, sum)`.
2. Inside `calculator`, `a` is `5`, `b` is `10`, and `operation` refers to `sum`.
3. `operation(a, b)` calls `sum(5, 10)`.
4. `sum` prints `15` in the message and finishes.
5. `calculator` finishes. Then the next calculator call starts.

```text
calculator(5, 10, sum)
          |
          v
operation refers to sum
          |
          v
operation(5, 10) → sum(5, 10) → prints 15
```

### Why I pass sum, not sum()

`sum` gives me the function value. `sum(5, 10)` calls the function now and gives me its return value.

```javascript
// With the functions above:
// calculator(5, 10, sum(5, 10));
```

If I uncomment this, `sum(5, 10)` runs first. My `sum` does not explicitly return a value, so it returns `undefined`. I would pass that `undefined` as `operation`. Then `operation(a, b)` would throw a TypeError.

I can also pass an arrow callback:

```javascript
// With calculator from above:
calculator(5, 10, (a, b) => {
  console.log(a - b); // -5
});
```

The arrow is a function value too. Its body runs when `calculator` calls it.

### A callback does not automatically mean async

In my calculator, the callback runs during the `calculator` call. It is synchronous.

With a timer, the callback runs later:

```javascript
function hello() {
  console.log("hello");
}

console.log("0");
setTimeout(hello, 2000);
console.log("1");
```

Output:

```text
0
1
hello
```

I register the timer, then continue to the next line. After the delay, `hello` becomes eligible to run. It still needs a turn to execute. Two seconds is a requested delay, not a guaranteed exact execution time.

### Where the browser keeps the waiting work

```text
My script calls setTimeout(hello, 2000)
                    |
                    v
Browser timer system keeps a reference to hello
                    |
             delay has passed
                    v
Timer task enters the task queue
                    |
      current task finishes; microtasks run
                    v
Event loop can select the timer task
                    |
                    v
hello is called → its execution context goes on the call stack
```

I do not think of the callback as sitting on the call stack for two seconds. It is not running while the timer waits. The callback function already exists; the browser does not need to create a new copy when the delay ends.

This is a simplified browser model. My Node.js `fs` example uses Node's runtime, not browser Web APIs.

### My long-loop example

In my `1.js`, I register timers and then print a million loop messages. That loop is synchronous. Timer callbacks cannot interrupt it.

I also register another timer after the loop. That timer starts when execution reaches its `setTimeout` call, not when the file first starts.

Inside one timer, I call `fs.writeFile`. The write starts only when that timer callback reaches the call. The file-write callback runs later, after the operation completes and the runtime can run the callback. Its position relative to other timer output can vary.

I do not need to run a million console messages to remember the rule:

**I pass the function now. The receiving function or runtime decides when to call it.**

My next note: [Callback Hell](#callback-hell).

### My references

- My calculator and timer practice: [2.js](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/2.js) and [1.js](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/1.js).
- My handwritten notes: [pages 1 and 9](HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf).
- Book: [JavaScript from Beginner to Professional](JSBook.pdf), Chapter 6, callback section, and Chapter 13, pages 346-349.

## Callback Hell

I already know how to pass a callback. Now I want one asynchronous operation to finish before I start the next one.

### Three calls do not automatically wait for each other

```javascript
function getData(dataId) {
  setTimeout(() => {
    console.log("Fetching data for id: " + dataId);
  }, 2000);
}

getData(1);
getData(2);
getData(3);
```

I call all three functions during the same synchronous execution. Each call registers its own timer and returns.

The requests do not start two seconds apart. Their waiting periods overlap. In this simple example, I expect these messages around the same time after roughly two seconds:

```text
Fetching data for id: 1
Fetching data for id: 2
Fetching data for id: 3
```

The messages still print one at a time. Overlapping waiting time does not mean three JavaScript callbacks execute at the same instant.

```text
Call 1 → timer 1 waits ──→ callback 1
Call 2 → timer 2 waits ──→ callback 2
Call 3 → timer 3 waits ──→ callback 3
```

### I start the next operation inside the callback

```javascript
function getData(dataId, nextData) {
  setTimeout(() => {
    console.log("Data fetched for id: " + dataId);

    if (nextData) {
      nextData();
    }
  }, 2000);
}

getData(1, () => {
  getData(2, () => {
    getData(3);
  });
});
```

This follows my `getData2` example from `3.js`. I use one name here so I can focus on the flow.

1. `getData(1, ...)` registers the first timer.
2. After its delay and scheduling wait, its callback prints the message for `1`.
3. It calls `nextData()`. That callback starts `getData(2, ...)`.
4. Only now does the second timer start.
5. After the second finishes, I start the third.
6. The third call has no `nextData` argument, so it prints its message and stops there.

Approximate timeline:

```text
0 s       2 s       4 s       6 s
|----------|----------|----------|
start 1    finish 1  finish 2  finish 3
           start 2   start 3
```

Real execution can be later than these times. The important part is when each operation starts.

### Where the hell part comes from

```javascript
// Same getData function as above:
getData(1, () => {
  getData(2, () => {
    getData(3, () => {
      getData(4, () => {
        console.log("All data fetched");
      });
    });
  });
});
```

Each next step is inside the previous callback. My code keeps moving to the right. This is the pyramid shape I drew in my hand note.

A little nesting is normal. I call it callback hell when the nesting makes the sequence, error handling and changes hard to follow.

If I add more work, I need to track which callback I am inside. If an operation can fail, I also need a clear way to report that error and stop the remaining work. The example above only demonstrates success; it does not implement an error path.

### When I actually need this order

If I need a user's ID before loading that user's orders, I cannot start the order request with that ID until I have it.

```text
Get user → receive user ID → get orders for that ID
```

But independent weather requests for three cities do not necessarily need this order. I first decide whether the next operation depends on the previous result. I do not make every async operation sequential just because I can.

### What I change next

I want to keep the dependency order without putting every next step inside another callback. A returned promise lets me write a flatter chain.

**The problem is not that callbacks are wrong. My problem is that a long dependent sequence becomes difficult to read when I keep nesting it.**

Previous: [Callback](#callback). Next: [Promises](#promises).

### My references

- My data-fetching examples: [3.js](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/3.js).
- My handwritten notes: [page 2](HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf).
- Book: [JavaScript from Beginner to Professional](JSBook.pdf), Chapter 13, callbacks and promises, pages 346-352.

## Promises

I use a promise to represent the eventual result of an operation. I can attach code for success and code for failure instead of putting every next operation inside a nested callback.

### State and result

```text
                    ┌→ fulfilled → fulfillment value
pending ────────────┤
                    └→ rejected  → rejection reason
```

A pending promise has not settled yet. A fulfilled or rejected promise is settled. Once settled, it cannot switch to the other state or get a different result.

In my simple examples, `resolve(data)` fulfills the promise with data, and `reject(error)` rejects it. More precisely, resolving with another promise makes it follow that promise's eventual outcome. So resolved and fulfilled do not always mean exactly the same thing.

### I create a small demo API

```javascript
function getData(dataId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dataId <= 0) {
        reject(new Error("Data ID must be positive"));
        return;
      }

      console.log("Data fetched for id: " + dataId);
      resolve(dataId);
    }, 2000);
  });
}
```

This is my `4.js` idea with a small rejection case added to explain failure too. It is a timer demo, not a real network request.

1. I call `getData(1)`.
2. `new Promise(...)` immediately calls the executor, the function receiving `resolve` and `reject`.
3. The executor registers the timer.
4. `getData` returns the pending promise.
5. Later, the timer callback checks the ID and either rejects or fulfills it.

I often receive promises from APIs and libraries. But I can create promises myself too. A promise does not have to come from a third-party API.

### I consume the result with then and catch

```javascript
// With getData from above:
getData(1)
  .then(dataId => {
    console.log("Data received: " + dataId);
  })
  .catch(error => {
    console.log("Error: " + error.message);
  });
```

Output after the timer gets a turn:

```text
Data fetched for id: 1
Data received: 1
```

The value I give to `resolve` becomes the fulfillment handler's argument. I can choose any parameter name; `dataId` is not a special keyword.

For failure, I run this separately:

```javascript
// With getData from above:
getData(0).catch(error => {
  console.log("Error: " + error.message);
});
// Error: Data ID must be positive
```

`reject` does not automatically stop the rest of my callback. That is why I return after it in the invalid-ID branch.

### Calling the function still starts the work

One comment in my practice says calling `getData(1)` without handling its promise causes an error. I correct that idea here.

```javascript
// With getData from above:
getData(1);
```

This still starts the timer and eventually prints `Data fetched for id: 1`. Ignoring a successful promise is not automatically an error. I simply do not use its fulfillment value.

If the promise rejects and I never handle that rejection, it can become an unhandled rejection. That is a different issue.

### Two separate calls overlap

```javascript
// With getData from above:
const first = getData(1);
const second = getData(2);

first.then(id => console.log("Received " + id));
second.then(id => console.log("Received " + id));
```

I started both operations before either result arrived. Adding `.then()` handlers does not make the second call wait for the first.

I need to delay the second function call itself if I want sequential work.

### I return the next promise in the chain

```javascript
// With getData from above:
getData(1)
  .then(dataId => {
    console.log("Data received: " + dataId);
    return getData(2);
  })
  .then(dataId => {
    console.log("Data received: " + dataId);
    return getData(3);
  })
  .then(dataId => {
    console.log("Data received: " + dataId);
  })
  .catch(error => {
    console.log("Error: " + error.message);
  });
```

Output:

```text
Data fetched for id: 1
Data received: 1
Data fetched for id: 2
Data received: 2
Data fetched for id: 3
Data received: 3
```

The second call starts inside the first fulfillment handler. Returning its promise makes the next link wait for its result. The same happens for the third call.

```text
getData(1)
    ↓ fulfills with 1
first handler → returns getData(2)
    ↓ fulfills with 2
second handler → returns getData(3)
    ↓ fulfills with 3
third handler
```

Each `.then()` returns a new promise. Returning a normal value fulfills the next promise with that value. Throwing an error rejects it. Returning a promise makes it follow that promise.

### What happens if I forget return

```javascript
// With getData from above; run separately:
getData(1)
  .then(() => {
    getData(2); // Started, but not returned to this chain
  })
  .then(value => {
    console.log(value); // undefined; does not wait for getData(2)
  });
```

The first handler returns `undefined`. The chain cannot track the second operation's result or rejection through that missing return.

I can nest `.then()` calls, as I did with `p3` and `p4` in my practice. But a flat returned chain is easier to follow, and one final `.catch()` can handle failures propagated through it. It does not automatically catch errors from unrelated promises I started and forgot to return.

### When the handler runs

```javascript
console.log("start");

const promise = new Promise(resolve => {
  console.log("executor");
  resolve("done");
});

promise.then(value => console.log(value));
console.log("end");
```

Output:

```text
start
executor
end
done
```

The executor runs synchronously. The fulfillment handler runs later as a microtask. Even an already fulfilled promise does not make its `.then()` handler run inline.

**I remember the return in a chain: start the next operation at the right time, then return its promise so the chain can follow it.**

Previous: [Callback Hell](#callback-hell). Next: [Async and Await](#async-and-await).

### My references

- My promise examples: [4.js](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/4.js).
- My handwritten notes: [pages 2-3](HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf).
- Book: [JavaScript from Beginner to Professional](JSBook.pdf), Chapter 13, pages 349-352.

## Async and Await

I already have promise chaining. Now I want to write the same dependent steps from top to bottom. `async` and `await` let me do that. They still use promises underneath.

### An async function always returns a promise

```javascript
async function getMessage() {
  return "Weather data fetched";
}

getMessage().then(message => console.log(message));
// Weather data fetched
```

I return a string inside the function, but the caller receives a promise that fulfills with that string. If an async function throws, its returned promise rejects. If it finishes without returning a value, its promise fulfills with `undefined`.

I can call an async function from global scope or inside another function, as long as it is accessible there. Global scope is not a requirement.

### My weather API demo

```javascript
function api() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Weather data fetched");
    }, 2000);
  });
}

async function getWeatherData() {
  console.log("Fetching weather data...");
  const data = await api();
  console.log(data);
}

getWeatherData();
console.log("Other work");
```

Output:

```text
Fetching weather data...
Other work
Weather data fetched
```

I follow the call like this:

1. `getWeatherData()` starts immediately and prints the fetching message.
2. `api()` starts the timer and returns a promise.
3. `await` suspends this async function's continuation while that promise is pending.
4. The caller continues and prints `Other work`.
5. The timer eventually fulfills the promise.
6. The async continuation runs as a microtask. `data` receives the fulfillment value, then I print it.

The async function does not sit on the active call stack during the whole wait. Its suspended state is kept so it can resume later.

**I pause this function's continuation, not the whole browser or Node.js process.**

If the promise rejects, `await` throws that rejection at the await expression when the function resumes. I handle that with `try...catch`, or let the async function's returned promise reject.

### Three separate calls still overlap

```javascript
function api2(city) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("Weather data fetched for city: " + city);
    }, 2000);
  });
}

async function getWeatherData2(city) {
  const data = await api2(city);
  console.log(data);
}

getWeatherData2("Dhaka");
getWeatherData2("Chittagong");
getWeatherData2("Khulna");
```

Each call starts its own operation, reaches its own `await`, then returns a promise to the caller. The caller immediately makes the next call.

I expect the three messages around the same time after roughly two seconds, rather than one every two seconds. They execute one at a time when scheduled; exact completion times are not guaranteed.

```text
Caller → Dhaka function       → starts API → waits
       → Chittagong function  → starts API → waits
       → Khulna function      → starts API → waits
```

Being called outside a function is not what causes this overlap. I would get the same behaviour inside another function if I made these calls without awaiting or chaining them.

### I start one city after the previous one finishes

```javascript
// With api2 from above; run this example separately:
async function getWeatherData3() {
  const data1 = await api2("Dhaka");
  console.log(data1);

  const data2 = await api2("Chittagong");
  console.log(data2);

  const data3 = await api2("Khulna");
  console.log(data3);
}

getWeatherData3().catch(error => console.log(error.message));
```

The first `await` must complete successfully before execution reaches the second API call. Then the same happens for the third.

```text
Start Dhaka → await → print Dhaka
                           ↓
                  Start Chittagong → await → print Chittagong
                                                        ↓
                                               Start Khulna → await → print Khulna
```

With these demo delays, the messages arrive at roughly two, four and six seconds, possibly later. I did not start three timers at the beginning. I start each timer only after the previous awaited operation finishes.

If I start all three API calls first and only then await their promises, their waiting periods have already overlapped. `await` does not undo work I already started.

### I can still use then and catch

```javascript
// With getWeatherData2 from above; run separately:
getWeatherData2("Dhaka")
  .then(() => getWeatherData2("Chittagong"))
  .then(() => getWeatherData2("Khulna"))
  .catch(error => console.log(error.message));
```

This is another way to express the same order. An async function still returns a promise, so `.then()` and `.catch()` still work. I can use them inside another async function too.

In this example, `getWeatherData2` prints the weather but has no explicit `return`. Its promise fulfills with `undefined`. The next handler is waiting for completion; it is not receiving the weather text. If I want that text outside the function, I need to return it.

### I handle an awaited failure with try and catch

This is a complete separate example:

```javascript
function api(city) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!city) {
        reject(new Error("City is required"));
        return;
      }
      resolve("Weather data fetched for city: " + city);
    }, 2000);
  });
}

async function showWeather(city) {
  try {
    const data = await api(city);
    console.log(data);
  } catch (error) {
    console.log("Could not load weather: " + error.message);
  }
}

showWeather("");
```

Output:

```text
Could not load weather: City is required
```

When `await` throws, the remaining lines in that `try` block are skipped. The `catch` handles the error here. Because I do not rethrow it, this particular async function then completes successfully with `undefined`.

For a dependent sequence, an unhandled rejection at an earlier `await` stops that function before later calls are reached. This is useful when the next step needs the first result.

### Why I use an async IIFE

IIFE means Immediately Invoked Function Expression. I define a function expression and call it immediately, without a separate named call afterward.

```javascript
// With api2 from the city example:
;(async function () {
  const data1 = await api2("Dhaka");
  console.log(data1);

  const data2 = await api2("Chittagong");
  console.log(data2);
})().catch(error => console.log(error.message));
```

The first semicolon keeps this expression separate from a preceding statement. The final `()` calls the function. The IIFE returns a promise, which I handle with `.catch()`.

It is still a function call. I have not removed the call; I have put it next to the definition. Local declarations stay in its function scope, but it can still access outer variables.

### Can I write await outside a function?

Yes, at the top level of an ES module.

```javascript
// ES module example; uses api2 from the city example:
const data = await api2("Dhaka");
console.log(data);
```

In Node.js, `.mjs` explicitly identifies an ES module. A `.js` file can also be a module through package settings. Recent Node versions can detect module syntax, including top-level `await`, in otherwise ambiguous `.js` files. An explicitly CommonJS file does not get that treatment.

In a browser, I use a module script for top-level `await`:

```html
<script type="module">
  const message = await Promise.resolve("Weather ready");
  console.log(message);
</script>
```

The function version and module version are alternatives; I do not need to put every example into one file. In particular, duplicate top-level function declarations with the same name are invalid in an ES module. That was the problem with my earlier two `getWeatherData` declarations.

### How I revise this

I keep one example active at a time. If I run the separate calls, the promise chain, the async sequence and the IIFE together, I start several independent flows. Each flow can have its own correct order while the combined console messages still mix.

**I check where I start an operation and where I await its result. Just adding `async` does not make separate calls wait for each other.**

Previous: [Promises](#promises).

### My references

- My weather examples: [5.js](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/5.js).
- My handwritten notes: [pages 4-5](HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf).
- Book: [JavaScript from Beginner to Professional](JSBook.pdf), Chapter 13, pages 353-354.
- [Node.js module syntax detection](https://nodejs.org/download/release/v26.2.0/docs/api/packages.html#syntax-detection).
