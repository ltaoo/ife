var FakePromise = require('./fakePromise/index.js');

const instance = new FakePromise((resolve, reject) => {
    setTimeout(() => {
        resolve('value');
    }, 1000);
}).then((res) => {
    return res;
}).then((res) => {
    console.log(res);
})

