//Promise Chaining 

function fun1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Function 1 executed");
            resolve("success");
        }, 1000);
    });
}

function fun2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Function 2 executed");
            resolve("success");
        }, 1000);
    });
}


// without promise chaining we can write it like this
let p1 = fun1();
p1.then((res) => {
    console.log("Function 1 resolved with data: " + res);

});

let p2 = fun2();
p2.then((res) => {
    console.log("Function 2 resolved with data: " + res);

});



// but we can write it like this using promise chaining

let p3 = fun1();
p3.then((res) => {
    console.log("Function 1 resolved with data: " + res);
    let p4 = fun2();
    p4.then((res) => {
        console.log("Function 2 resolved with data: " + res);
    });
});


// ata tw deferent function er jonno promise chaining kora hoise but amra ekta function er moddhe onno function ke call kore promise chaining korte pari. jeta onekta callback hell er moto. but amra promise chaining er maddhome callback hell avoid korte pari.

function getData(dataId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Data fetched for id: " + dataId);
            resolve(dataId);
        }, 2000);
    });
}

getData(1).then((dataId) => {
    console.log("Data received: " + dataId);
    return getData(2);
}).then((dataId) => {
    console.log("Data received: " + dataId);
    return getData(3);
}).then((dataId) => {
    console.log("Data received: " + dataId);
}).catch((error) => {
    console.log("Error: " + error);
});