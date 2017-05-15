const Promise = require('promise');

const fetch = function () {
    return new Promise((resolve, reject) => {
        resolve('hello');
    });
}

fetch()
    .then(res => console.log(res))
    .catch(err => console.log(err));
