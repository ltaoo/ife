const fetch = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello');
        }, 3000);
    });
}

fetch();
