const fs = require("node:fs");

console.log("1");

setTimeout(() => {
    console.log("2");
}, 2000);

setTimeout(() => {
    console.log("4");

    fs.writeFile("output.txt", "Hello from the timer!", (error) => {
        if (error) {
            console.error("Failed to write file:", error);
            return;
        }

        console.log("File written successfully!");
    });
}, 0);



for (let i = 0; i < 1000000; i++) {
    console.log("loop iteration: " + i);
}

setTimeout(() => {
    console.log("6");
}, 1000);



console.log("3");


