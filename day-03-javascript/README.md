# Day 3 - JavaScript

I read my notes in this order. Each file covers a different part of the topic.

| Order | Note | What I keep here |
| --- | --- | --- |
| 1 | [Variables, Scope, Functions, Types, Modules](Variables_Scope_Functions_Types_Modules.md) | var/let/const, block scope, hoisting, TDZ, closures, arrows, this, primitives and objects, coercion, equality, import/export |
| 2 | [Objects, Prototypes, Inheritance, Classes](Objects_Prototypes_Inheritance_Classes.md) | Detailed prototype lookup, own vs inherited properties, constructors, new, extends/super, private fields, getters/setters, static methods and composition |
| 3 | [Callbacks, Callback Hell, Promises, Async/Await](CallBack_CallbackHell_Promises_AsysncAwait.md) | My calculator, nested data fetching, returned promise chains, weather examples, errors, IIFE and top-level await |
| 4 | [Event Loop, Call Stack, Execution Context, Iteration](EventLoop_CallStack_ExecutionContext_CallbackQueue.md) | GEC/FEC and memory steps, browser timers, callback queue, tasks vs microtasks, execution order, iterators and generators |
| 5 | [Memory, Metaprogramming, Engine Internals, Concurrency](Memory_Metaprogramming_EngineInternals_Concurrency.md) | Short idea notes: garbage collection, leaks, weak references, descriptors, Proxy/Reflect, V8 shapes and caches, deoptimisation, concurrency vs parallelism and AbortController |

## My practice and references

- [Callback, promise and async practice](JS%20PRACTICE/Callback_Hell_Promises_Async_Await/).
- [Event-loop and timer practice](JS%20PRACTICE/EventLoop%2CCallBack%20Queue%2C%20Call%20Stack/).
- [Research tasks](research-task.md): mixed execution order and memory retained by a closure.
- [My handwritten notes](HandNote_Callback_Promise_AsncAwait_ExecutionContext_EventLoop_callStack_callbackQueue.pdf).
- [JavaScript from Beginner to Professional](JSBook.pdf): my book reference.

I run independent examples separately. Browser examples use browser APIs; a demo endpoint must exist before I can fetch it. I keep module examples in their stated separate files.
