//Async and Await 
// Promise er Syntex easy kore 
// kono function ar age jodi async likha thake tahole shei function always promise return korbe.
// ar amra jani promise amra normally create , resolve or reject kori na. ata 3rd party api kore 

async function getWeatherDataDummy() {
    //API call using await
    // aikhane api promise return korbe
}

//arma api ta nijerai demo kori
function api() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Weather data fetched");
        }, 2000);
    });
}
async function getWeatherData() {

    console.log("Fetching weather data...");
    const data = await api(); //await will wait for the promise to resolve or reject
    console.log(data);
}
getWeatherData();


// promise er chaining ta dekhi tahole aikhane async await er maddhome. we know promise chaining tai callback. callback er kothin somossha ta easy kore dekhai
function api2(city) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Weather data fetched for city: " + city);
        }, 2000);
    });
}
async function getWeatherData2(city) {
    const data = await api2(city);
    console.log(data);
}
// promise por por execution hosse na. akshate call korei hosse. akta resolve kore onno ta hosse na
getWeatherData2("Dhaka");
getWeatherData2("Chittagong");
getWeatherData2("Khulna");

// bairer scope theke call korle akshte resolve korbe oikhetre nicher style e korte hobe
// atai promise chaining.... ata chaile getWeatherData2 function er bhitore likha jai...

getWeatherData2("Dhaka").then(() => {
    return getWeatherData2("Chittagong");
}).then(() => {
    return getWeatherData2("Khulna");
}).catch((error) => {
    console.log(error);
});


// abar chaining aivabe o kora jai : jodi function er scope er moddhe thake taile tahole aivabe chaining kora jai...
async function getWeatherData3() {
    const data1 = await api2("Dhaka");
    console.log(data1);
    const data2 = await api2("Chittagong");
    console.log(data2);
    const data3 = await api2("Khulna");
    console.log(data3);
}
getWeatherData3();



// global scope ekbar call kortese but inside function protita promise resolve kore next promise call kortese...
// aikhane .then() .catch() use kora lage na tai bola hoy promise er kaj soja hoye gese... 
// jokhon amra chai akta kaj resolve hobar por next kaj ta start hobe akshate na
// database theke 1st email ache kina check korlo
// email paise then password check korlo
// password paise then login korlo

// ai 3 ta kaj akshate kora jabe na



// An async function always returns a Promise.
// I can call it from global scope or inside another function,
// as long as the function is accessible there.
//
// Calling a Promise-returning function does not automatically
// make the next line wait.
//
// If I use await, the current async function waits for the result
// before continuing to its next line.
// Other code outside that function can still run.
//
// I can also use .then() and .catch() inside an async function.
// With await, I usually use try...catch to handle errors.





// using of iife
// IIFE = Immediately Invoked Function Expression
// IIFE is a function that runs as soon as it is defined.

//iife use korle amra async function ke global scope theke call kora lage na. Jodio node v26 e amniteo lage na 


/* async function getWeatherData3() {
    const data1 = await api2("Dhaka");
    console.log(data1);
    const data2 = await api2("Chittagong");
    console.log(data2);
    const data3 = await api2("Khulna");
    console.log(data3);
}

getWeatherData3();
 */



(async function getWeatherData3() {
    const data1 = await api2("Dhakaaaaa");
    console.log(data1);
    const data2 = await api2("Chittagonggggg");
    console.log(data2);
    const data3 = await api2("Khulnaaaaa");
    console.log(data3);
})();


// if node js v26
const data11 = await api2("Dhakaaaaa!!!");
console.log(data11);
const data21 = await api2("Chittagonggggg!!");
console.log(data21);
const data31 = await api2("Khulnaaaaa!!");
console.log(data31);



//IIFE e use hoy code e karo shate kono conflict na kore kaj korar jonno 
// IIFE Html e ache setha...