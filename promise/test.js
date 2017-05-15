var Promise = require('./fakePromise/index.js');

function fetch() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('hello world');
        }, 3000);
    });
}

fetch()
    // .then(res => console.log(res));
