# Objects, Prototypes, Inheritance, and Classes

I first create an object and read its properties. Then I follow prototype lookup, share behaviour through inheritance, and write the same ideas using classes.

I run examples separately unless I say they continue the previous one.

## 1. An object groups related values

```javascript
const student = {
  name: "Saikat",
  city: "Dhaka",
  greet() {
    return `Hello ${this.name}`;
  }
};

console.log(student.name); // Saikat
console.log(student["city"]); // Dhaka
console.log(student.greet()); // Hello Saikat

const key = "name";
console.log(student[key]); // Saikat
student.city = "Khulna";
student.subject = "JavaScript";
delete student.subject;
```

A property has a key and a value. A method is a property whose value is a function. Brackets let me use a key stored in a variable. `student.key` would look for the literal property name `key`.

In `student.greet()`, the receiver is `student`, so this regular method receives that object as `this`.

## 2. Own properties and inherited properties differ

```javascript
const person = {
  greet() {
    return `Hello ${this.name}`;
  }
};

const student = Object.create(person);
student.name = "Saikat";

console.log(student.greet()); // Hello Saikat
console.log(Object.hasOwn(student, "name")); // true
console.log(Object.hasOwn(student, "greet")); // false
console.log("greet" in student); // true
console.log(Object.keys(student)); // ["name"]
```

`name` belongs directly to `student`. `greet` is found through its prototype. `Object.create(person)` establishes that relationship; it does not copy all of person's properties into student.

`Object.hasOwn()` checks only the object itself. `in` also checks its prototype chain. `Object.keys()` returns own enumerable string keys, so it does not list this inherited method.

## 3. I follow the prototype chain

For the previous objects:

```text
student: own name
    ↓ [[Prototype]]
person: own greet
    ↓ [[Prototype]]
Object.prototype
    ↓ [[Prototype]]
null
```

When I read `student.greet`, JavaScript:

1. Looks for an own property named `greet` on student.
2. If absent, checks student's prototype, person.
3. Finds the method there.
4. Calls it with student as the receiver because I wrote `student.greet()`.

The place where the method is found does not change that receiver. Inside it, `this.name` reads `student.name`.

If lookup reaches `null` without finding a property, an ordinary read gives `undefined`. Calling that missing value as a function would throw TypeError.

```javascript
// With student and person from above:
console.log(Object.getPrototypeOf(student) === person); // true
console.log(Object.getPrototypeOf(person) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

An object's internal prototype link is not the same thing as an ordinary property named `prototype`. I use `Object.getPrototypeOf()` to inspect the link rather than relying on the legacy `__proto__` accessor.

## 4. Shadowing an inherited property

```javascript
const settings = { theme: "light" };
const userSettings = Object.create(settings);

console.log(userSettings.theme); // light
userSettings.theme = "dark";
console.log(userSettings.theme); // dark
console.log(settings.theme); // light
console.log(Object.hasOwn(userSettings, "theme")); // true

delete userSettings.theme;
console.log(userSettings.theme); // light
```

The assignment creates an own property in this example, hiding the inherited value. Deleting it reveals the prototype's value again. The inherited property was not deleted.

This example uses an ordinary writable data property. An inherited setter or a non-writable property can change what assignment does.

### Inherited nested objects can still be shared

```javascript
const defaults = { options: { sound: true } };
const first = Object.create(defaults);
const second = Object.create(defaults);

first.options.sound = false;
console.log(second.options.sound); // false
```

I looked up the same inherited `options` object and mutated it. I did not create a separate options object for each child. I normally put per-instance mutable state on each instance.

## 5. Constructor functions and new

```javascript
function Student(name) {
  this.name = name;
}

Student.prototype.greet = function () {
  return `Hello ${this.name}`;
};

const first = new Student("Saikat");
const second = new Student("Mina");

console.log(first.greet()); // Hello Saikat
console.log(second.greet()); // Hello Mina
console.log(first.greet === second.greet); // true
console.log(Object.getPrototypeOf(first) === Student.prototype); // true
```

For this constructor, I trace `new Student("Saikat")` like this:

1. Create a new object.
2. Connect its prototype to `Student.prototype`.
3. Call Student with that object as `this` and the supplied argument.
4. `this.name = name` creates an own property.
5. Return the instance because this constructor does not explicitly return another object.

```text
first: name = Saikat ──┐
                      ├→ Student.prototype: greet
second: name = Mina ───┘            ↓
                             Object.prototype → null
```

`Student.prototype` is an object used as the prototype of these instances. `Student` itself is a function object with its own internal prototype link. I keep those relationships separate.

The name is per instance. The method is shared rather than recreated for every instance. If I assign a new function inside the constructor instead, each call creates its own function value.

## 6. Classes give me a clearer syntax

```javascript
class Student {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

const student = new Student("Saikat");
console.log(student.greet()); // Hello Saikat
console.log(Object.hasOwn(student, "name")); // true
console.log(Object.hasOwn(student, "greet")); // false
console.log(Object.getPrototypeOf(student) === Student.prototype); // true
```

A class still uses prototype-based behaviour. The ordinary instance method `greet` is on `Student.prototype`, while `name` is stored on each instance.

Classes also have their own rules:

- I call a class constructor with `new`; a plain `Student()` call throws.
- Class bodies run in strict mode.
- A class declaration cannot be used before its initialization; it has a TDZ.
- Ordinary class methods are non-enumerable.

So I do not assume classes are identical to every hand-written constructor pattern.

## 7. Inheritance with extends and super

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  introduce() {
    return `I am ${this.name}`;
  }
}

class Student extends Person {
  constructor(name, subject) {
    super(name);
    this.subject = subject;
  }

  introduce() {
    return `${super.introduce()}. I study ${this.subject}`;
  }
}

const student = new Student("Saikat", "JavaScript");
console.log(student.introduce()); // I am Saikat. I study JavaScript
console.log(student instanceof Student); // true
console.log(student instanceof Person); // true
```

I follow the construction:

1. `new Student(...)` invokes the derived constructor.
2. `super(name)` invokes the parent constructor and initializes this instance's `name`.
3. Only after `super()` can this derived constructor use `this`.
4. It adds the own `subject` property.

I override `introduce` by defining a method with the same name in the child class. `super.introduce()` accesses the parent method and calls it with the current student as `this`.

```text
student: name, subject
      ↓
Student.prototype: introduce override
      ↓
Person.prototype: introduce
      ↓
Object.prototype
      ↓
null
```

`instanceof` normally checks for a constructor's prototype in the object's prototype chain. It is not a comparison of property contents or a universal validator for every possible object.

A derived class without an explicit constructor gets a default constructor that forwards arguments to its parent.

## 8. Private fields, getters and setters

```javascript
class Account {
  #balance;

  constructor(initialBalance = 0) {
    this.balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  set balance(amount) {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Balance must be a non-negative finite number");
    }
    this.#balance = amount;
  }

  deposit(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Deposit must be a positive finite number");
    }
    this.balance = this.#balance + amount;
    return this.#balance;
  }
}

const account = new Account(100);
console.log(account.deposit(50)); // 150
console.log(account.balance); // 150
account.balance = 200;
console.log(account.balance); // 200
```

`#balance` is a private field. Outside code cannot directly access it. Writing `account.#balance` outside the declaring class would be a syntax error.

I read the getter and assign through the setter using property syntax, without calling `balance()`. The setter lets me validate assignments. I use `#balance` inside it so it does not call itself recursively.

Private fields are not ordinary public properties found by prototype lookup. A subclass cannot directly use the parent's private field name; it can use the parent's public methods.

## 9. Static methods belong to the class

```javascript
class Student {
  constructor(name) {
    this.name = name;
  }

  static fromName(name) {
    return new Student(name);
  }
}

const student = Student.fromName("Saikat");
console.log(student.name); // Saikat
console.log(typeof student.fromName); // undefined
```

I call the static method through Student, not through an instance. A static method is useful for a factory or an operation that belongs to the class rather than one particular instance.

## 10. A class method is not automatically bound

```javascript
class Student {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return this.name;
  }
}

const student = new Student("Saikat");
const greet = student.greet;
// greet(); // TypeError: this is undefined
const boundGreet = student.greet.bind(student);
console.log(boundGreet()); // Saikat
```

Passing a detached method as a callback can lose its receiver. I can bind it, or call it through an arrow wrapper that retains access to the instance.

An arrow class field such as `greet = () => this.name` captures the instance's this, but creates an own function value per instance. It is different from an ordinary shared prototype method.

## 11. When I use inheritance

I use inheritance when the child really is a more specific kind of the parent and can sensibly support its behaviour. I do not build a deep class hierarchy just to share one helper.

Composition is another option: an object can use another object's behaviour without inheriting from it.

```javascript
const notifier = {
  send(message) {
    console.log(message);
  }
};

class Course {
  constructor(notifier) {
    this.notifier = notifier;
  }
  enroll(name) {
    this.notifier.send(`${name} enrolled`);
  }
}

new Course(notifier).enroll("Saikat"); // Saikat enrolled
```

Course uses a notifier; it is not a type of notifier. This relationship does not need inheritance.

My reminder: **I first check own properties, then the prototype chain. Classes organize that relationship; they do not remove it.**

Previous: [Variables, Scope, Functions, Types, and Modules](Variables_Scope_Functions_Types_Modules.md).

Next: [Callbacks, Callback Hell, Promises, and Async/Await](CallBack_CallbackHell_Promises_AsysncAwait.md).
