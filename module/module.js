function CoolModule () {
    var something = 'cool'

    var another = [1, 2, 3]

    function doSomething () {
        console.log(something)
    }
    function doAnother () {
        console.log(another.join('!'))
    }

    return {
        doSomething,
        doAnother
    }
}

var foo = CoolModule()

foo.doSomething()
foo.doAnother()