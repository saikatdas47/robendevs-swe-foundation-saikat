//event Loop


console.log("start");
setTimeout(function cb1() { console.log("one"); }, 1000);
setTimeout(function cb2() { console.log("two"); }, 999);
setTimeout(function cb3() { console.log("three"); }, 2000);
console.log("end");

/* 
console.log("start");
setTimeout(function cb1() { console.log("one"); }, 1000);
setTimeout(function cb2() { console.log("two"); }, 999.99);
setTimeout(function cb3() { console.log("three"); }, 2000);
console.log("end");
 */


/* 
console.log("start");
setTimeout(function cb1() { console.log("one"); }, 1000);
setTimeout(function cb2() { console.log("two"); }, 999.9999999999999999999999999999);
setTimeout(function cb3() { console.log("three"); }, 2000);
console.log("end"); */