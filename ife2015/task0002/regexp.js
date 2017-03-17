var reg = /(([0-9]{3}[1-9]{1})|([0-9]{2}[1-9]{1}[0-9]{1})|([0-9]{1}[1-9]{1}[0-9]{2})|([1-9]{1}[0-9]{3}))/

function handleNumber(number) {
    var len = number.toString().length
    /* console.log(len, '0'.repeat(len)) */
    return '0'.repeat(4-len) + number
}


console.log(reg.test('0000'))

var reg2 = /[0-9]{4}/
var _not = []
var _yes = []
for(var i = 0; i < 10000; i++) {
    if(reg.test(handleNumber(i))) {
        _not.push(i)
    }
    if(reg2.test(handleNumber(i))) {
        _yes.push(i)
    }
}

console.log(_not.length, _yes.length)

// console.log(reg.test('1993'))


