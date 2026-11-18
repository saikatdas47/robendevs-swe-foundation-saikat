// Callback
//callback function is a function that is passed as an argument to another function and is executed after some operation has been completed. It allows us to write asynchronous code in a more readable and maintainable way. 

function sum(a, b) {
    console.log("The sum of a and b is: " + (a + b));
}

function multiply(a, b) {
    console.log("The product of a and b is: " + (a * b));
}

function calculator(a, b, operation) {
    operation(a, b); //here operation is a callback function that can be sum or multiply
}

calculator(5, 10, sum);
calculator(5, 10, multiply);


// we dont use () in the callback function because we are not calling the function, we are just passing the reference of the function to the calculator function. If we use () then it will call the function and pass the return value to the calculator function which is not what we want. We want to pass the reference of the function so that it can be called later inside the calculator function.


console.log(".................CallBack Hell..................");
// callback hell
// Callback hell is a situation where we have multiple nested callbacks, which makes the code hard to read and maintain. It is also known as "Pyramid of Doom". It can be avoided by using Promises or async/await.


// leets see a code 

function getData(dataId) {
    setTimeout(() => {
        console.log("Fetching data for id: " + dataId);
    }, 2000);
}

getData(1);
getData(2);
getData(3);

// same kaj ta nasted function diye kora jai 

function getData2(dataId, callback) {

    setTimeout(() => {

        console.log( dataId);
        if (callback) {
            callback();
        }


    }, 2000);
}

getData2(1, () => {
    getData2(2, () => {
        getData2(3);
    });
});

// here callback hell is created because we have nested callbacks. It is hard to read and maintain. We can avoid this by using Promises or async/await.