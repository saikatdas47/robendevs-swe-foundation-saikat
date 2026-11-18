# Variables, Scope, Functions, Types, and Modules

I start with how I store values and where I can use their names. Then I follow functions, closures and `this`. After that, I compare values and split code into modules.

I run each code block separately unless I say it continues an earlier example. A commented-out error line is something I can uncomment to see the error, not part of the successful output.

## 1. Variables: var, let and const

A variable binding connects a name to a value. I declare the name, initialize it with a value, and sometimes assign a different value later.

```javascript
let score = 10; // Declaration and initialization
score = 20;     // Reassignment
const name = "Saikat";
console.log(name, score); // Saikat 20
```

| Rule | var | let | const |
| --- | --- | --- | --- |
| Can I reassign it? | Yes | Yes | No |
| Can I redeclare it in the same ordinary scope? | Yes, with var | No | No |
| Does an ordinary block limit its scope? | No | Yes | Yes |
| Before its declaration executes | Usually reads as undefined | TDZ: access throws | TDZ: access throws |
| Can I omit the initializer in an ordinary declaration? | Yes | Yes | No |

I usually choose `const` first. If I need reassignment, I use `let`. I learn `var` because I still need to understand code that uses it.

```javascript
var age = 20;
var age = 25; // Allowed here
console.log(age); // 25

let points;
console.log(points); // undefined: its declaration already ran
points = 10;

// let points = 30; // SyntaxError: redeclaration
// const city;     // SyntaxError: missing initializer
```

A syntax error can prevent the whole script from running. I test those invalid declarations separately instead of expecting earlier lines to print first.

### const protects the binding, not the object's contents

```javascript
const user = { name: "Saikat" };
user.name = "Rafi";
console.log(user.name); // Rafi

const skills = ["HTML"];
skills.push("JavaScript");
console.log(skills); // ["HTML", "JavaScript"]

// user = { name: "Mina" }; // TypeError
// skills = [];            // TypeError
```

I can change the existing objects. I cannot assign a different value to either const binding. `const` does not freeze an object.

## 2. Scope: where I can use a name

### Global, function and block scope

```javascript
const city = "Dhaka";

function introduce() {
  const name = "Saikat";

  if (true) {
    const subject = "JavaScript";
    console.log(name, city, subject); // Saikat Dhaka JavaScript
  }

  // console.log(subject); // ReferenceError
}

introduce();
// console.log(name); // ReferenceError in this isolated example
```

`city` is in the outer scope. `name` belongs to the function. `subject` belongs to the inner block.

When I read a name, JavaScript checks the current scope, then its outer scopes. Outer code cannot look inward and read a function's local binding by its name.

```text
Outer scope: city
      ↓ accessible inside
Function scope: name
      ↓ accessible inside
Block scope: subject
```

I call this lexical scope: the nesting in my source code determines which outer bindings a function can access. Calling the function from somewhere else does not give it that caller's local variables.

### var ignores an ordinary block

```javascript
function checkScope() {
  if (true) {
    var oldScore = 10;
    let newScore = 20;
    const fixedScore = 30;
  }

  console.log(oldScore); // 10
  // console.log(newScore);   // ReferenceError
  // console.log(fixedScore); // ReferenceError
}

checkScope();
// console.log(oldScore); // ReferenceError
```

`oldScore` belongs to `checkScope`, not the `if` block. It is still local to that function. `var` is not always global.

At the top level of a browser classic script, `var` can create a property on the global object. Top-level `let` and `const` do not create those properties. In an ES module, top-level declarations belong to the module. In a Node.js CommonJS file, top-level variables are local to its module wrapper.

### Shadowing creates a different binding

```javascript
const city = "Dhaka";

function visit() {
  const city = "Khulna";
  console.log(city); // Khulna
}

visit();
console.log(city); // Dhaka
```

The inner `city` does not update the outer one. Inside the function, it hides the outer binding with the same name.

## 3. Hoisting and the Temporal Dead Zone

I understand hoisting as declarations being handled during setup before statements execute. My source code does not physically move.

### var starts with undefined

```javascript
console.log(score); // undefined
var score = 10;
console.log(score); // 10
```

The binding is set up and initialized to `undefined` before the first log. The assignment of `10` happens later, when execution reaches it.

### let and const exist but cannot be accessed yet

```javascript
// console.log(score); // ReferenceError
let score = 10;
console.log(score); // 10
```

The binding is in the Temporal Dead Zone from the start of its scope until initialization. `const` has the same access restriction before initialization.

```javascript
const score = 10;

{
  // console.log(score); // ReferenceError if uncommented
  const score = 20;
  console.log(score); // 20
}
```

The inner declaration shadows the outer one throughout that block. Before initialization, I hit the inner binding's TDZ; JavaScript does not skip it and use the outer `10`.

Even `typeof` throws for a binding in its TDZ. That differs from `typeof` on a genuinely undeclared name, which normally returns `"undefined"`.

### Function declarations and function expressions differ

```javascript
sayHello(); // Hello

function sayHello() {
  console.log("Hello");
}
```

This function declaration is initialized during setup. I can call it before its source line.

```javascript
// greet(); // ReferenceError: greet is in its TDZ
const greet = function () {
  console.log("Hello");
};
greet(); // Hello
```

The function expression follows the binding's rules. With `var greet`, the earlier binding would be `undefined`; trying to call that value would throw TypeError instead.

## 4. Functions: inputs, outputs and function values

```javascript
function add(a, b = 0) {
  return a + b;
}

console.log(add(5, 3)); // 8
console.log(add(5)); // 5
```

`a` and `b` are parameters. The values I pass are arguments. `return` sends a value to the caller and finishes that call. A default parameter is used for a missing argument or `undefined`, not for `null`.

A function with no explicit return value returns `undefined`. Printing a value is different from returning it.

Functions are values, so I can store them, pass them as callbacks and return them from another function.

## 5. Closures: my function keeps access to outer bindings

```javascript
function createAccount(initialBalance) {
  let balance = initialBalance;

  return function addMoney(amount) {
    balance += amount;
    return balance;
  };
}

const myAccount = createAccount(100);
console.log(myAccount(50)); // 150
console.log(myAccount(25)); // 175

const anotherAccount = createAccount(200);
console.log(anotherAccount(10)); // 210
console.log(myAccount(0)); // 175
```

I follow the first account:

1. `createAccount(100)` creates a local `balance` initialized to `100`.
2. It creates and returns the inner function. It does not call that function yet.
3. I save the function in `myAccount`.
4. The outer call finishes, but the returned function retains access to its outer binding.
5. Calling `myAccount(50)` changes the same balance to `150`.
6. The next call uses `150`, rather than resetting to `100`.

```text
myAccount       → returned function → balance binding: 175
anotherAccount  → returned function → separate balance binding: 210
```

A closure combines a function with access to its lexical environment. It keeps access to bindings, not just frozen copies of their initial values.

The local `balance` name is not directly available outside `createAccount`. Each outer call creates separate state. If I keep a closure reachable, data it needs can stay reachable too; finishing the outer call does not automatically release that data.

### A loop example helps me compare var and let

```javascript
const withVar = [];
for (var i = 0; i < 3; i++) {
  withVar.push(() => i);
}
console.log(withVar.map(read => read())); // [3, 3, 3]

const withLet = [];
for (let j = 0; j < 3; j++) {
  withLet.push(() => j);
}
console.log(withLet.map(read => read())); // [0, 1, 2]
```

The first functions share one `var i` binding. When I call them after the loop, its value is `3`. This `let` loop creates separate per-iteration bindings, so the functions retain their respective iteration values.

## 6. Arrow functions

```javascript
const double = number => number * 2;
const add = (a, b) => {
  return a + b;
};
const makeUser = name => ({ name });

console.log(double(4)); // 8
console.log(add(2, 3)); // 5
console.log(makeUser("Saikat").name); // Saikat
```

An expression body returns its result automatically. A block body needs an explicit `return` if I want a value. I wrap an object literal in parentheses so it is treated as an expression rather than a block.

An arrow has no own `this` or `arguments`. It takes them from its surrounding environment. I can use rest parameters for its inputs:

```javascript
const total = (...numbers) => {
  return numbers.reduce((sum, number) => sum + number, 0);
};
console.log(total(1, 2, 3)); // 6
```

An arrow is not a constructor. Calling it with `new` throws TypeError. I choose an arrow for its behaviour, not only because its syntax is shorter.

## 7. this: I check how a regular function is called

`this` is different from lexical variable lookup. For an ordinary function, the call form matters.

### A method call uses its receiver

```javascript
"use strict";

const user = {
  name: "Saikat",
  greet() {
    return "Hello " + this.name;
  }
};

console.log(user.greet()); // Hello Saikat

const other = { name: "Mina", greet: user.greet };
console.log(other.greet()); // Hello Mina
```

In `user.greet()`, the receiver is `user`. In `other.greet()`, it is `other`. The same function can receive a different `this` depending on the call.

### Copying the method does not keep its receiver

```javascript
"use strict";

const user = {
  name: "Saikat",
  greet() {
    return this.name;
  }
};

const greet = user.greet;
// greet(); // TypeError: this is undefined in this strict-mode plain call

console.log(greet.call(user)); // Saikat
console.log(greet.apply({ name: "Mina" })); // Mina
const fixedGreet = greet.bind(user);
console.log(fixedGreet()); // Saikat
```

`call` and `apply` call the function immediately with a chosen `this`. For additional arguments, `call` accepts them separately and `apply` accepts an array or array-like object. `bind` returns a new function for later calls.

A plain call to a non-strict ordinary function uses the global object instead. I do not rely on that to find my object's properties.

### An arrow keeps the surrounding this

```javascript
const counter = {
  value: 0,
  incrementLater() {
    setTimeout(() => {
      this.value++;
      console.log(this.value); // 1
    }, 0);
  }
};

counter.incrementLater();
```

The regular method receives `counter` as `this`. The arrow is created during that method call and uses the same surrounding `this` when it runs later.

An object literal itself does not create a `this` binding. Writing `greet: () => this.name` inside an object does not make `this` refer to that object. At the top level of an ES module, `this` is `undefined`.

`call`, `apply` and `bind` cannot replace an arrow's lexical `this`. For a constructor call such as `new Person()`, an ordinary constructor normally receives the new instance as `this`.

My reminder: **for a regular function, I inspect the call; for an arrow, I inspect the surrounding this.**

## 8. Types: primitives and objects

JavaScript has seven primitive types: string, number, bigint, boolean, undefined, symbol and null. Objects include arrays, functions and ordinary objects.

```javascript
console.log(typeof "JS"); // string
console.log(typeof 10); // number
console.log(typeof 10n); // bigint
console.log(typeof false); // boolean
console.log(typeof undefined); // undefined
console.log(typeof Symbol("id")); // symbol
console.log(typeof null); // object: historical behaviour
console.log(typeof []); // object
console.log(typeof function () {}); // function
```

`typeof null` does not mean null is an object. I use `Array.isArray(value)` when I need to distinguish an array from other objects.

### Primitive values are immutable

```javascript
let first = "JS";
let second = first;
second = "JavaScript";

console.log(first); // JS
console.log(second); // JavaScript
```

I changed which value `second` holds. I did not edit the original string. String methods also return results rather than mutating the string value.

### Assigning an object value can share the same object

```javascript
const first = { name: "Saikat" };
const second = first;
second.name = "Mina";

console.log(first.name); // Mina
console.log(first === second); // true
```

I often call this reference behaviour. Both bindings refer to the same object; assignment did not clone its contents.

```text
first  ──┐
         ├──→ one object: { name: "Mina" }
second ──┘
```

### Arguments are passed by value too

```javascript
function update(user) {
  user.name = "Mina";
  user = { name: "Rafi" };
}

const person = { name: "Saikat" };
update(person);
console.log(person.name); // Mina
```

The function receives a copy of the object reference value. Mutating that shared object is visible outside. Reassigning the local parameter does not reassign `person`. This is why saying objects are simply passed by reference can be misleading.

### Spread makes a shallow copy

```javascript
const original = { name: "Saikat", address: { city: "Dhaka" } };
const copy = { ...original };

copy.name = "Mina";
copy.address.city = "Khulna";

console.log(original.name); // Saikat
console.log(original.address.city); // Khulna
console.log(original === copy); // false
console.log(original.address === copy.address); // true
```

The outer objects are different, but the nested address is shared. Shallow copying does not recursively duplicate everything.

## 9. Type coercion

Coercion converts a value from one type to another during an operation. I can also convert explicitly so my intention is clear.

```javascript
console.log("10" + 5); // "105"
console.log("10" - 5); // 5
console.log(Number("10") + 5); // 15
console.log(Number("hello")); // NaN
console.log(String(25)); // "25"
console.log(Boolean("")); // false
console.log(Boolean("false")); // true
console.log(Boolean([])); // true
console.log(Boolean({})); // true
```

With a string operand here, `+` joins text. Subtraction performs numeric conversion. The string `"false"` is truthy because it is non-empty, not because its text means true.

Common falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`. Empty arrays and ordinary empty objects are truthy.

## 10. == vs ===

```javascript
console.log(5 == "5"); // true
console.log(5 === "5"); // false
console.log(false == 0); // true
console.log(false === 0); // false
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log([] == false); // true
console.log([] === false); // false
```

`==` follows conversion rules when the operand types differ. `===` does not perform that cross-type conversion. I normally choose `===` so I do not accidentally depend on implicit conversions.

The `[] == false` example is not a truthiness check. Loose equality applies its own conversions. It does not mean an empty array is falsy.

### Objects compare identity, not matching contents

```javascript
console.log({ name: "Saikat" } === { name: "Saikat" }); // false
console.log([1, 2] === [1, 2]); // false

const user = { name: "Saikat" };
const sameUser = user;
console.log(user === sameUser); // true
console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN)); // true
```

The first two comparisons create different objects. Matching properties do not make their identities equal. `NaN` is also a special case I remember: it is not strictly equal to itself.

## 11. ES modules: I split code into files

A module has its own top-level scope. I explicitly export what another module can use, then import it there. ES modules run in strict mode automatically.

### Named exports

These three blocks belong to separate files in one folder:

```javascript
// math.js
export const subject = "JavaScript";

export function add(a, b) {
  return a + b;
}
```

```javascript
// greet.js
export default function greet(name) {
  return `Hello ${name}`;
}
```

```javascript
// app.js
import welcome from "./greet.js";
import { add, subject as course } from "./math.js";

console.log(welcome("Saikat")); // Hello Saikat
console.log(add(2, 3)); // 5
console.log(course); // JavaScript
```

Named imports use the exported names, with an optional alias through `as`. A default import can use a local name I choose, such as `welcome`. A module can have many named exports but only one default export.

I can also collect the named exports into a namespace:

```javascript
// A separate module beside math.js:
import * as math from "./math.js";
console.log(math.add(2, 3)); // 5
```

I write relative paths starting with `./` and include the extension for these browser and Node.js ES module examples.

### How I run the files

For a browser, I load the entry file as a module and serve the folder through an HTTP development server:

```html
<script type="module" src="./app.js"></script>
```

Its static dependencies load and are evaluated before the importing module's body executes. Module scripts are deferred by default. I do not put static `import` declarations inside an ordinary function.

For Node.js, I can put a `package.json` beside these example files with this explicit setting, then run `node app.js`:

```json
{
  "type": "module"
}
```

Alternatively, I can use `.mjs` files and update the import paths to match. These are example setup options; I do not need to change my practice folder just to read this note.

### Imports are live bindings

```javascript
// counter.js
export let count = 0;
export function increment() {
  count++;
}
```

```javascript
// use-counter.js
import { count, increment } from "./counter.js";

console.log(count); // 0
increment();
console.log(count); // 1

// count = 100; // TypeError: I cannot reassign an imported binding
```

The import is not a frozen snapshot of the initial number. I see updates made by the exporting module. I cannot directly reassign its imported binding. If an imported value is an object, that restriction does not automatically freeze the object's properties.

### Dynamic import is different

```javascript
// A module beside math.js:
async function calculate() {
  const math = await import("./math.js");
  console.log(math.add(4, 5)); // 9
}

calculate().catch(error => console.log(error.message));
```

Static imports declare dependencies at the top level. `import()` is an expression I can call when needed, including inside a function; it returns a promise for the module namespace.

Modules can also use top-level `await`. That is different from using `await` at the top level of a classic browser script or an explicitly CommonJS file.

## My revision order

I first check what kind of binding I declared and which scope owns it. Then I check whether it has been initialized. For a function, I separate its lexical scope from how its `this` is chosen. For values, I check whether I am sharing an object or working with a primitive. Finally, I use exports and imports to make connections between files explicit.

Related notes:

- [Callbacks, Callback Hell, Promises, and Async/Await](CallBack_CallbackHell_Promises_AsysncAwait.md).
- [Event Loop, Call Stack, Execution Context, and Iteration](EventLoop_CallStack_ExecutionContext_CallbackQueue.md).
