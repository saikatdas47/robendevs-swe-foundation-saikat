# Day 3 - My JavaScript Book Notes

My reference is [JavaScript from Beginner to Professional](JSBook.pdf) by Laurence Lars Svekis, Maaike van Putten and Rob Percival (Packt, 2021).

I follow the book's chapter order. Page numbers below are the printed page numbers inside the book, not the PDF viewer numbers. These are my study notes, with short examples adapted from the book's topics. I use my own words and smaller examples to make the ideas easy to follow.

I run each example separately unless I say they belong together. DOM examples run in a browser. When an example has HTML and JavaScript together, I save it as an HTML file and open it in the browser.

## 1. Getting Started with JavaScript

Book reference: Chapter 1, pages 1-16.

### What JavaScript does

HTML gives my page its structure. CSS controls how it looks. JavaScript lets the page do things, like respond to a click or change a message.

First, I can open the browser console and run this:

```javascript
console.log("Hello JavaScript"); // Hello JavaScript
console.log(5 + 3); // 8
```

`console.log()` shows a value in the console. It does not write that value into the page.

### Adding JavaScript to HTML

I can write code inside a `script` tag. I can also keep it in a separate file, which is easier to manage when the code gets bigger.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My JS Practice</title>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Day 3</h1>
  </body>
</html>
```

```javascript
// app.js
console.log("My script is running");
```

Here, `src` gives the file path. `defer` lets this external script run after the HTML has been parsed. So the page elements are ready when my script uses them.

### Comments, input and random values

```javascript
// This is a one-line comment.
/* This comment can cover
   more than one line. */

const name = prompt("What is your name?");
console.log("Hello", name);
console.log(Math.random()); // A number from 0 up to, but not including, 1
```

`prompt()` returns text, or `null` if I cancel. `Math.random()` gives a different value on different calls; I cannot predict an exact output.

My reminder: first make the file run, then start adding more code.

## 2. JavaScript Essentials

Book reference: Chapter 2, pages 17-45.

### Variables

A variable gives a value a name. Then I can use that name instead of writing the value everywhere.

```javascript
let score = 10;
score = 15;
const name = "Saikat";
console.log(name, score); // Saikat 15
```

I use `let` when I need to assign a new value later. I use `const` when I do not need reassignment. The book also introduces `var`. It has different scope rules, which I explain in Chapter 6.

`const` does not mean an object can never change. It means I cannot assign a different value to that variable. I will see this with arrays in the next chapter.

### Primitive data types

| Type | Example | How I remember it |
| --- | --- | --- |
| String | `"Saikat"` | Text |
| Number | `25`, `3.5` | Ordinary numbers |
| BigInt | `123n` | Integers that can go beyond Number's safe integer range |
| Boolean | `true`, `false` | Yes/no values |
| Undefined | `undefined` | Often a value that has not been assigned |
| Null | `null` | A value I use to mean no value |
| Symbol | `Symbol("id")` | A unique symbol value |

```javascript
const name = "Saikat";
let result;
const selectedItem = null;

console.log(`Hello ${name}`); // Hello Saikat
console.log(typeof name); // string
console.log(typeof result); // undefined
console.log(typeof selectedItem); // object
```

`typeof null` returning `"object"` is an old JavaScript behaviour. It does not mean `null` is an object.

### Converting values

```javascript
console.log("10" + 5); // "105"
console.log(Number("10") + 5); // 15
console.log(String(25)); // "25"
console.log(Boolean("")); // false
console.log(Boolean("false")); // true
```

In the first line, `+` joins text. After `Number("10")`, it adds numbers. The text `"false"` is not empty, so its Boolean conversion is `true`.

### Operators

```javascript
console.log(10 + 3); // 13
console.log(10 - 3); // 7
console.log(10 * 3); // 30
console.log(10 / 2); // 5
console.log(10 % 3); // 1: remainder
console.log(2 ** 3); // 8: power

let total = 10;
total += 5;
console.log(total); // 15

console.log(5 == "5"); // true
console.log(5 === "5"); // false
console.log(10 > 5 && 3 < 4); // true
console.log(false || true); // true
console.log(!true); // false
```

`=` assigns. `==` compares and can convert types. `===` compares without that type conversion. I normally use `===` so the comparison is easier to understand.

`&&` means both conditions must pass in this Boolean example. `||` means at least one must pass. More generally, these operators return one of their operands, so the result is not always a Boolean.

## 3. JavaScript Multiple Values

Book reference: Chapter 3, pages 47-69.

### Arrays

An array holds an ordered list. Its first index is `0`.

```javascript
const names = ["Saikat", "Rafi", "Mina"];
console.log(names[0]); // Saikat
console.log(names.length); // 3
names[1] = "Nila";
console.log(names); // ["Saikat", "Nila", "Mina"]
```

The array changed even though I used `const`. I changed an item, not the variable's assignment.

### Adding, removing and finding items

```javascript
const items = ["book", "pen"];
items.push("bag"); // Add at the end
items.unshift("pencil"); // Add at the start
console.log(items); // ["pencil", "book", "pen", "bag"]

items.pop(); // Remove bag from the end
items.shift(); // Remove pencil from the start
items.splice(1, 1, "marker"); // At index 1, remove 1 item and add marker
console.log(items); // ["book", "marker"]
console.log(items.indexOf("marker")); // 1
console.log(items.includes("bag")); // false
console.log(items.find(item => item === "book")); // book
```

`indexOf()` gives `-1` when it cannot find the item. `find()` gives `undefined` when no item matches.

```javascript
const numbers = [20, 3, 100];
numbers.sort((a, b) => a - b);
console.log(numbers); // [3, 20, 100]
numbers.reverse();
console.log(numbers); // [100, 20, 3]
```

Without a comparison function, `sort()` sorts using string order. That can give a surprising result for numbers. Both `sort()` and `reverse()` change the original array.

### Nested arrays and objects

```javascript
const grid = [[1, 2], [3, 4]];
console.log(grid[1][0]); // 3

const student = {
  name: "Saikat",
  address: { city: "Dhaka" },
  skills: ["HTML", "CSS"]
};
student.skills.push("JavaScript");
console.log(student.address.city); // Dhaka
console.log(student["name"]); // Saikat
console.log(student.skills[2]); // JavaScript
```

An object stores named properties. An array is useful when the order matters. I can combine them, like a list of student objects.

My reminder: in `grid[1][0]`, I select the second inner array first, then its first item.

## 4. Logic Statements

Book reference: Chapter 4, pages 71-86.

### if, else if and else

```javascript
const score = 75;

if (score >= 80) {
  console.log("Great");
} else if (score >= 50) {
  console.log("Passed");
} else {
  console.log("Try again");
}
// Output: Passed
```

JavaScript checks from the top. The first matching branch runs, then it skips the remaining branches in this chain.

A condition does not need to be written as `=== true`. JavaScript checks whether the value is truthy or falsy. Common falsy values include `false`, `0`, `""`, `null`, `undefined` and `NaN`. An empty array and an empty object are truthy.

### Ternary operator

```javascript
const age = 20;
const message = age >= 18 ? "Adult" : "Under 18";
console.log(message); // Adult
```

I read it as: if the condition passes, use the first value; otherwise, use the second value. It is useful for a small choice.

### switch

```javascript
const day = "Friday";

switch (day) {
  case "Friday":
  case "Saturday":
    console.log("Weekend");
    break;
  default:
    console.log("Study day");
}
// Output: Weekend
```

The two cases share the same work. `break` exits the switch. Without it, execution can continue into the next case's statements.

My reminder: I use `===` for a comparison. Writing `=` inside a condition assigns a value instead.

## 5. Loops

Book reference: Chapter 5, pages 87-115.

### while and do while

```javascript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
// Output: 0, then 1, then 2
```

First check, then run, then check again. When `count` becomes `3`, the condition is false and the loop stops.

```javascript
let count = 5;
do {
  console.log(count); // 5
  count++;
} while (count < 3);
```

A `do while` checks after running the body. So it runs at least once.

### for and nested loops

```javascript
for (let i = 1; i <= 3; i++) {
  console.log(i);
}
// Output: 1, then 2, then 3

for (let row = 1; row <= 2; row++) {
  for (let column = 1; column <= 2; column++) {
    console.log(row, column);
  }
}
// Output pairs: 1 1, 1 2, 2 1, 2 2
```

For each outer iteration, the inner loop runs again from its starting value.

### Looping through arrays and objects

```javascript
const skills = ["HTML", "CSS", "JS"];
for (const skill of skills) {
  console.log(skill);
}
// HTML, then CSS, then JS

const user = { name: "Saikat", city: "Dhaka" };
for (const key of Object.keys(user)) {
  console.log(key, user[key]);
}
// name Saikat
// city Dhaka
```

`for...of` gives array values. The book also covers `for...in`, which gives enumerable property names and can include inherited ones. `Object.keys()` gives the object's own enumerable string keys.

### break and continue

```javascript
for (let i = 1; i <= 5; i++) {
  if (i === 2) continue;
  if (i === 4) break;
  console.log(i);
}
// Output: 1, then 3
```

`continue` skips the rest of the current iteration. `break` ends the loop. In nested loops, a normal `break` exits only the nearest loop. The book also shows labels to target an outer loop.

My reminder: I check how the loop will stop. If its condition never becomes false and nothing exits it, it keeps running.

## 6. Functions

Book reference: Chapter 6, pages 117-147.

### Parameters, arguments and return

A function groups work so I can use it again.

```javascript
function greet(name = "friend") {
  return `Hello ${name}`;
}
console.log(greet("Saikat")); // Hello Saikat
console.log(greet()); // Hello friend
```

`name` is the parameter in the definition. `"Saikat"` is the argument in the call. The default is used when the argument is missing or `undefined`, not when it is `null`.

`return` sends a value back and stops that function call. Printing something with `console.log()` does not return that value. A function with no explicit return value gives `undefined`.

### Expressions and arrows

```javascript
const add = function (a, b) {
  return a + b;
};
const double = number => number * 2;
console.log(add(2, 3)); // 5
console.log(double(4)); // 8
```

The arrow returns its expression automatically here. If I use a block body with braces, I need `return` to send back a value.

### Spread and rest

```javascript
function add(a, b) {
  return a + b;
}
const numbers = [2, 3];
console.log(add(...numbers)); // 5

function collect(...values) {
  return values;
}
console.log(collect(1, 2, 3)); // [1, 2, 3]
```

Spread opens a collection into separate values. Rest collects separate arguments into an array. The dots look the same, but their position tells me the job.

### Scope

```javascript
const city = "Dhaka";
function showCity() {
  const message = "My city";
  console.log(message, city);
}
showCity(); // My city Dhaka
// console.log(message); // ReferenceError
```

The function can use its outer variable, but outside code cannot use the function's local name `message`.

`let` and `const` have block scope. `var` has function scope, or global scope when declared at the top level of a classic script. It is not always global.

### IIFE, recursion and nested functions

```javascript
(function () {
  const message = "Run now";
  console.log(message);
})();
```

This is an Immediately Invoked Function Expression. I create the function and call it immediately.

```javascript
function factorial(number) {
  if (number <= 1) return 1;
  return number * factorial(number - 1);
}
console.log(factorial(4)); // 24
```

For a non-negative integer input, the calls get smaller until the stopping condition. Then the results return: `1`, `2`, `6`, `24`.

```javascript
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const next = makeCounter();
console.log(next()); // 1
console.log(next()); // 2
```

This extends the book's nested-function idea to a closure. The returned function keeps access to `count` after the outer call ends. It uses the same binding on both calls, so the count does not reset.

### Callbacks

```javascript
function processName(name, callback) {
  callback(name);
}
processName("Saikat", name => console.log(`Hi ${name}`));
// Hi Saikat
```

A callback is a function I pass to another function for it to call. Here it runs immediately. A callback does not automatically mean asynchronous code.

## 7. Classes

Book reference: Chapter 7, pages 149-165.

### Constructor, properties and methods

```javascript
class Student {
  constructor(name) {
    this.name = name;
  }
  introduce() {
    return `I am ${this.name}`;
  }
}
const student = new Student("Saikat");
console.log(student.introduce()); // I am Saikat
```

The class describes how I create this kind of object. `new` creates an instance and calls the constructor. In this constructor, `this` refers to the new instance. `name` is its property, and `introduce` is a method.

### Getters and setters

```javascript
class Account {
  #balance = 0;
  get balance() {
    return this.#balance;
  }
  set balance(amount) {
    if (amount < 0) throw new Error("Balance cannot be negative");
    this.#balance = amount;
  }
}
const account = new Account();
account.balance = 100;
console.log(account.balance); // 100
```

I access a getter like a property, without `()`. Assigning to the setter runs its code. The `#balance` field is private to the class; I cannot directly access it from outside.

### Inheritance and prototypes

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello ${this.name}`;
  }
}
class Student extends Person {
  constructor(name, subject) {
    super(name);
    this.subject = subject;
  }
}
const student = new Student("Saikat", "JavaScript");
console.log(student.greet()); // Hello Saikat
```

`extends` sets up inheritance. In this derived constructor, `super(name)` calls the parent constructor before I use `this`.

JavaScript uses prototypes for this lookup. If `greet` is not on the instance, JavaScript checks its prototype chain. Class methods are shared through prototypes rather than copied into every instance.

My reminder: for an ordinary method call like `student.greet()`, the receiver before the dot supplies `this`. An arrow function takes `this` from its surrounding scope instead.

## 8. Built-In JavaScript Methods

Book reference: Chapter 8, pages 167-204.

### Global methods

```javascript
console.log(parseInt("25px", 10)); // 25
console.log(parseFloat("3.5kg")); // 3.5
console.log(Number("25px")); // NaN

const encoded = encodeURIComponent("JS & HTML");
console.log(encoded); // JS%20%26%20HTML
console.log(decodeURIComponent(encoded)); // JS & HTML
```

Parsing can read a number from the start of text. `Number()` requires the whole string to be a valid numeric form, apart from surrounding whitespace. For a single URL parameter value, I use `encodeURIComponent()`.

The book also introduces `encodeURI()` for a whole URI, the older `escape()`/`unescape()` functions, and `eval()`. I keep those as reading topics here. `eval()` executes text as JavaScript; I do not need it to convert JSON or do ordinary calculations.

### Array methods

```javascript
const numbers = [1, 2, 3, 4];
console.log(numbers.map(n => n * 2)); // [2, 4, 6, 8]
console.log(numbers.filter(n => n > 2)); // [3, 4]
console.log(numbers.every(n => n > 0)); // true
numbers.forEach(n => console.log(n)); // Prints each number
console.log([1, 2, 1].lastIndexOf(1)); // 2
```

`map()` builds an array from returned values. `filter()` keeps matching items. `every()` checks whether all items pass. `forEach()` is for doing work for each item; it returns `undefined`.

```javascript
const values = [1, 2, 3, 4];
values.copyWithin(0, 2);
console.log(values); // [3, 4, 3, 4]
```

`copyWithin()` copies a range to another position inside the same array. It changes the array without increasing its length.

### String methods

```javascript
const text = "  JavaScript is fun  ";
console.log(text.trim()); // "JavaScript is fun"
console.log("JavaScript".slice(0, 4)); // Java
console.log("Hello JS".replace("JS", "Saikat")); // Hello Saikat
console.log("js".toUpperCase()); // JS
console.log("HTML,CSS,JS".split(",")); // ["HTML", "CSS", "JS"]
console.log(["HTML", "CSS"].join(" + ")); // HTML + CSS
console.log("JavaScript".startsWith("Java")); // true
```

Strings are immutable. These operations produce results; they do not edit the original string value. I save the result if I need it later.

### Number, Math and Date

```javascript
console.log(Number.isNaN(NaN)); // true
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isInteger(4)); // true
console.log((3.14159).toFixed(2)); // "3.14" - a string
console.log(Math.max(5, 10, 3)); // 10
console.log(Math.sqrt(16)); // 4
console.log(Math.floor(3.9)); // 3
console.log(Math.ceil(3.1)); // 4
console.log(Math.round(3.5)); // 4
console.log(Math.trunc(-3.9)); // -3

const dice = Math.floor(Math.random() * 6) + 1;
console.log(dice); // An integer from 1 to 6

const date = new Date("2026-11-17T00:00:00Z");
console.log(date.getUTCFullYear()); // 2026
console.log(date.getUTCMonth()); // 10
console.log(date.toISOString()); // 2026-11-17T00:00:00.000Z
```

Months start at `0`, so November is `10`. UTC methods use UTC; methods such as `getHours()` use the local time zone. The book also covers powers, logarithms, precision and changing date parts.

## 9. The Document Object Model

Book reference: Chapter 9, pages 205-223.

### HTML, BOM and DOM

An HTML element has tags and can have attributes, like `<p id="message">Hello</p>`.

The DOM is the browser's object representation of the document. I use it to read and change page elements. The BOM describes browser-related objects, such as `window`, `location`, `history` and `navigator`.

```html
<p id="message">Old message</p>
<script>
  const message = document.getElementById("message");
  console.log(message.textContent); // Old message
  console.log(window.location.href); // This page's URL
  console.log(document.title); // This document's title
</script>
```

`window` gives browser APIs. `document` represents the page inside that browser context. `history` relates to navigation history, and `navigator` exposes browser-related information and capabilities.

My reminder: DOM means the document. BOM means the surrounding browser APIs.

## 10. Dynamic Element Manipulation Using the DOM

Book reference: Chapter 10, pages 225-263.

### Selecting and traversing

```html
<ul id="skills">
  <li class="skill">HTML</li>
  <li class="skill">CSS</li>
</ul>
<script>
  const list = document.querySelector("#skills");
  const first = document.querySelector(".skill");
  const all = document.querySelectorAll(".skill");
  console.log(first.textContent); // HTML
  console.log(all.length); // 2
  console.log(list.children.length); // 2
  console.log(first.nextElementSibling.textContent); // CSS
</script>
```

`querySelector()` gives the first match or `null`. `querySelectorAll()` gives a static NodeList of matches. I can also select by ID, tag name or class name with the methods shown in the book.

`parentElement`, `children` and `nextElementSibling` help me move between elements. `childNodes` can also include text nodes, such as whitespace between tags.

### Changing content, styles, classes and attributes

```html
<p id="message">Old text</p>
<script>
  const message = document.querySelector("#message");
  message.textContent = "Learning JavaScript";
  message.style.color = "blue";
  message.classList.add("active");
  message.classList.toggle("hidden");
  message.setAttribute("title", "My study note");
</script>
```

`textContent` puts text into the element. `innerText` is aware of rendered text. `innerHTML` parses HTML markup. For a plain text message, `textContent` is enough.

Adding a class name does not create CSS rules. I need matching CSS if I want the class to change the appearance.

### Creating elements and handling clicks

```html
<button id="add" type="button">Add skill</button>
<ul id="skills"></ul>
<script>
  const button = document.querySelector("#add");
  const list = document.querySelector("#skills");
  button.addEventListener("click", () => {
    const item = document.createElement("li");
    item.textContent = "JavaScript";
    list.append(item);
  });
</script>
```

Each click creates a new `li`, sets its text and adds it to the list. `createElement()` alone does not put it on the page. I need to insert it too. I can remove an element with `element.remove()`.

## 11. Interactive Content and Event Listeners

Book reference: Chapter 11, pages 265-299.

### Events

An event tells my code something happened: a click, a key press, an input change or a form submission.

The book shows inline handlers, properties such as `onclick`, and `addEventListener()`. With `addEventListener()`, I can register more than one handler for the same event.

### target, currentTarget and event flow

```html
<div id="box"><button type="button">Click me</button></div>
<script>
  const box = document.querySelector("#box");
  box.addEventListener("click", event => {
    console.log(event.target.tagName); // BUTTON when I click the button
    console.log(event.currentTarget.id); // box
  });
</script>
```

The click starts at the button, but its event can bubble up to the parent. `target` identifies where the event originated in this example. `currentTarget` is the element whose listener is running.

The order is capture toward the target, the target phase, then bubbling outward for events that bubble. Passing `{ capture: true }` registers a capture listener. `stopPropagation()` stops further propagation; `preventDefault()` cancels a cancelable default action. They do different jobs.

### Input, keyboard and forms

```html
<form id="greeting">
  <label>Name <input id="name" required></label>
  <button type="submit">Say hello</button>
</form>
<p id="result"></p>
<script>
  const form = document.querySelector("#greeting");
  const input = document.querySelector("#name");
  const result = document.querySelector("#result");

  input.addEventListener("input", () => {
    result.textContent = `Typing: ${input.value}`;
  });
  input.addEventListener("keydown", event => {
    console.log(event.key);
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    result.textContent = `Hello ${input.value}`;
  });
</script>
```

The submit handler prevents normal form navigation and updates the page. `input` reacts while the value changes. `change` usually happens when a change is committed. `blur` means focus left the element.

### Other events in this chapter

- `DOMContentLoaded`: the HTML has been parsed.
- Window `load`: the page and its dependent resources have loaded.
- Mouse events: actions such as moving, pressing and releasing.
- Drag and drop: `dragstart`, `dragover` and `drop`; a drop target normally cancels `dragover`'s default behaviour to allow a drop.
- Animation: changing a value over time. The book uses timers; for visual frame updates, I can use `requestAnimationFrame()`.

My reminder: a listener waits for an event. Registering it does not immediately run its callback.

## 12. Intermediate JavaScript

Book reference: Chapter 12, pages 301-343.

### Regular expressions

A regular expression describes a text pattern.

```javascript
const text = "I study JavaScript and javascript";
console.log(/javascript/i.test(text)); // true
console.log(text.match(/javascript/gi)); // ["JavaScript", "javascript"]
console.log("Order 123".replace(/\d+/g, "X")); // Order X
```

`i` ignores case. `g` finds all matches in this use of `match()`. `\d` matches a digit and `+` means one or more. The book goes further with alternatives, character classes and groups.

### arguments

```javascript
function showArguments() {
  console.log(arguments.length);
  console.log(arguments[0]);
}
showArguments("JS", "CSS");
// 2
// JS
```

Ordinary functions have an `arguments` object. It is array-like, but it is not an Array. Arrow functions have no own `arguments`; rest parameters are a clear way to collect their inputs.

### Hoisting and strict mode

```javascript
console.log(score); // undefined
var score = 10;

sayHello(); // Hello
function sayHello() {
  console.log("Hello");
}
```

JavaScript sets up bindings before executing the code. The source lines do not physically move. A `var` binding starts as `undefined`; the assignment happens when that line runs. A function declaration is available before its declaration line executes.

```javascript
// console.log(points); // ReferenceError if I uncomment this line
let points = 10;
```

`let` and `const` cannot be accessed before initialization. That period is the Temporal Dead Zone.

```javascript
"use strict";
// accidentalName = "Saikat"; // ReferenceError: no declaration
```

Strict mode catches some mistakes that older non-strict code permits. ES modules and class bodies already run in strict mode.

### Debugging and errors

```javascript
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}
try {
  console.log(divide(10, 0));
} catch (error) {
  console.log(error.message); // Cannot divide by zero
} finally {
  console.log("Finished checking");
}
```

The zero check is my own rule here; JavaScript normally gives `Infinity` for `10 / 0`. `throw` raises the error, `catch` handles it, and `finally` runs afterward in this example.

For debugging, I set a breakpoint in DevTools, run the code, inspect variables and step through the next lines. That helps me see where my expectation and the actual value become different.

### Cookies, local storage and JSON

Run this on an HTTP or HTTPS page, such as a local development server:

```javascript
const user = { name: "Saikat", skills: ["JS"] };
localStorage.setItem("user", JSON.stringify(user));

const savedText = localStorage.getItem("user");
const savedUser = savedText === null ? null : JSON.parse(savedText);
console.log(savedUser.name); // Saikat
localStorage.removeItem("user");
```

Local storage holds strings. `JSON.stringify()` converts suitable data to JSON text. `JSON.parse()` converts JSON text back into a JavaScript value. Invalid JSON throws an error.

Cookies are another storage mechanism. Applicable cookies can be sent with HTTP requests; local storage is not automatically sent that way. Browser JavaScript cannot read cookies marked `HttpOnly`.

My reminder: JSON is a data format, not a full copy of every JavaScript value. It cannot directly preserve functions, for example.

## 13. Concurrency

Book reference: Chapter 13, pages 345-361.

### What asynchronous code means

I can start work, let the environment handle waiting, and continue running other code. When the result is ready, my continuation can run.

Concurrency means tasks can make progress over overlapping periods. It does not necessarily mean my JavaScript statements run at the same instant. Within one JavaScript agent, ordinary code runs one job at a time.

### Callbacks and timers

```javascript
console.log("Start");
setTimeout(() => console.log("Timer"), 0);
console.log("End");
// Start
// End
// Timer
```

The timer registers work for later. A delay of `0` does not interrupt the current code and does not promise an exact execution time.

### Promises

A promise can be pending, fulfilled or rejected. I attach handlers to deal with its result.

```javascript
const result = new Promise(resolve => {
  console.log("Executor");
  resolve("Done");
});
result.then(value => console.log(value));
console.log("After setup");
// Executor
// After setup
// Done
```

The executor runs immediately. The `.then()` handler runs later as a microtask after the current synchronous work finishes.

I return a value from a `.then()` handler to pass it to the next handler. Returning a promise makes the chain wait for its result. A thrown error rejects the next promise, which I can handle with `.catch()`.

### async and await

```javascript
function waitForMessage() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data ready"), 10);
  });
}
async function run() {
  console.log("Loading");
  try {
    const message = await waitForMessage();
    console.log(message);
  } catch (error) {
    console.log(error.message);
  }
}
run();
console.log("Other work");
// Loading
// Other work
// Data ready
```

An async function returns a promise. It starts running immediately until it reaches a suspension point. `await` pauses that function's continuation, not the whole browser. Other code can run while it waits.

### Call stack, tasks and microtasks

The call stack tracks active function calls. A function call goes on top; when it finishes, it comes off. Waiting timers do not stay on this stack.

The book introduces the stack and callback queue. For mixed promises and timers, I also need the distinction between tasks and microtasks:

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// A
// D
// C
// B
```

1. The current script prints `A` and registers the timer.
2. It queues the promise handler, then prints `D`.
3. At the microtask checkpoint, the promise handler prints `C`.
4. A later timer task prints `B`.

Microtasks added by other microtasks are also processed before the checkpoint finishes. A long microtask chain can delay timers and rendering.

For the longer Day 3 execution-order exercise and closure memory example, I use [research-task.md](research-task.md).

My reminder: I mark synchronous lines first, then track microtasks, then follow later tasks. I do not guess output from the order the callbacks appear in the file.

## 14. HTML5, Canvas, and JavaScript

Book reference: Chapter 14, pages 363-402.

### Reading a chosen local file

```html
<input id="file" type="file" accept="text/*">
<pre id="output"></pre>
<script>
  const input = document.querySelector("#file");
  const output = document.querySelector("#output");
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      output.textContent = reader.result;
    });
    reader.addEventListener("error", () => {
      output.textContent = "Could not read the file";
    });
    reader.readAsText(file);
  });
</script>
```

I choose a file first. Then the reader reads it asynchronously. Reading a file locally does not upload it to a server.

### Geolocation

```javascript
// Run in a secure browser context. The browser asks for permission.
navigator.geolocation.getCurrentPosition(
  position => {
    console.log(position.coords.latitude, position.coords.longitude);
  },
  error => console.log(error.message)
);
```

The result depends on permission and whether a position is available. I do not assume the success callback always runs.

### Drawing on canvas

```html
<canvas id="board" width="300" height="150">A blue rectangle.</canvas>
<script>
  const canvas = document.querySelector("#board");
  const context = canvas.getContext("2d");
  context.fillStyle = "blue";
  context.fillRect(20, 30, 100, 50);
  context.beginPath();
  context.arc(200, 60, 25, 0, Math.PI * 2);
  context.stroke();
</script>
```

The origin is at the top-left. Increasing `x` moves right; increasing `y` moves down. `fillRect()` draws a filled rectangle. `arc()` adds a circle here, and `stroke()` draws its outline.

The chapter also covers lines, text, images, animation and mouse drawing. To animate, I update the state and draw again. To follow the mouse, I convert pointer coordinates into canvas coordinates, accounting for its position and displayed size.

`canvas.toDataURL()` can export canvas content as an image data URL. Drawing a cross-origin image without the required permission can prevent canvas export.

### Media and accessibility

```html
<video controls width="320">
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
</video>
```

This needs actual video and caption files. The browser provides playback controls. I also use meaningful labels, keyboard-accessible controls and text alternatives. For interactive canvas content, a picture alone is not enough to explain every action to someone using assistive technology.

## 15. Next Steps

Book reference: Chapter 15, pages 403-423.

### Libraries and frameworks

A library gives me reusable tools. A framework usually provides more structure for building an application. The exact boundary can vary.

The book introduces jQuery, D3, Underscore and React, then Vue and Angular. I treat this as the book's 2021 overview, not a current popularity ranking or installation guide.

My next learning step is to understand the JavaScript behind the tool: functions, arrays, objects, DOM updates and asynchronous work.

### APIs and AJAX

An API gives my code a way to interact with another system. AJAX describes updating page data through asynchronous requests without a full page reload. The response can be JSON; it does not have to be XML.

This example needs a server that provides `/api/student` and returns JSON:

```javascript
async function loadStudent() {
  try {
    const response = await fetch("/api/student");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const student = await response.json();
    console.log(student);
  } catch (error) {
    console.log(error.message);
  }
}
loadStudent();
```

First I wait for the response, check its status, then wait for JSON parsing. `fetch()` does not reject just because the server returns an HTTP error status such as `404`; that is why I check `response.ok`.

### Node.js and Express

Node.js lets me run JavaScript outside the browser. Express is a framework used to build servers with Node.js. Browser DOM objects such as `document` are not built into Node.js.

The book introduces backend routes and JSON responses. Before following package setup steps, I need the documentation for the version I actually use.

## My revision path

I keep the same order when revising:

1. Run a script and check its output.
2. Store values and understand their types.
3. Group values with arrays and objects.
4. Choose a path with conditions.
5. Repeat work with loops.
6. Reuse work with functions.
7. Create related objects with classes and prototypes.
8. Use built-in methods instead of rewriting common operations.
9. Understand the browser's document objects.
10. Select and change page elements.
11. Respond to events.
12. Work with patterns, errors, storage and JSON.
13. Follow asynchronous execution in the right order.
14. Read files, draw graphics and use browser media features.
15. Connect these basics to libraries and backend APIs.

For practice, I can follow the book's projects in the same order: a converter, a product list, a condition-based game, a multiplication table, a recursive function, a class-based calculator, a countdown, DOM updates, an accordion, event-based interactions, form validation, a promise exercise, canvas drawing and an API-backed list.

The appendix, starting at printed page 425, has the book's exercise and quiz answers. I try the exercise first, then compare my reasoning with the answer.
