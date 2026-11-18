//Promises 

// let create  a promise using setTimeout function

function getData(dataId) {
    
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Data fetched for id: " + dataId);
            resolve(dataId);
        }, 2000);
    });
    return myPromise;

    //or we can write it like this
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         console.log("Data fetched for id: " + dataId);
    //         resolve(dataId);
    //     }, 2000);
    // });

}

// getData(1); ager moto aivabe likhle error asbe cz getData function return kore promise but amra promise ke handle kori nai. 

getData(1).then((dataId) => {
    console.log("Data received: " + dataId);
}).catch((error) => {
    console.log("Error: " + error);
});

// or 

let promise = getData(2);

promise.then((dataId) => {
    console.log("Data received: " + dataId);
}).catch((error) => {
    console.log("Error: " + error);
});

