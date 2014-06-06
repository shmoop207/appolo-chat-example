Appolo Class  [![Build Status](https://travis-ci.org/shmoop207/appolo-class.png?branch=master)](https://travis-ci.org/shmoop207/appolo-class) [![Dependencies status](https://david-dm.org/shmoop207/appolo-class.png)](https://david-dm.org/shmoop207/appolo-class)
=======
Classical JavaScript inheritance pattern and full class system for nodejs.

## Installation ##
```javascript
npm install appolo-class --save
```

## Usage ##
### creating simple class ###
```javascript
var Rectangle = Class.define({
    area: function () {
        return 25;
    }
});

 var rectangle = new Rectangle();
```

creating class with constractor
```javascript
var Rectangle = Class.define({
    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },

    area: function () {
        return this.width * this.height;
    }
});

var rectangle = new Rectangle(5, 5);

console.log(rectangle.area()) // 25
```
### Inheritance  ###
```javascript
var Rectangle = Class.define({

    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },
    area: function () {
        return this.width * this.height;
    }
});

var Square = Class.define({

    $config: {
        extends: Rectangle
    },
    
    constructor: function (side) {
        this.callParent(this, side, side);
    }
});

var square = new Square(6);

console.log(square.area()) // 36
```
you can also use `Class.define` fucntion
```javascript
var Rectangle = Class.define({

    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },
    area: function () {
        return this.width * this.height;
    }
});

var Square = Rectangle.define({

    constructor: function (side) {
        this.callParent(side, side);
    }
});

var square = new Square(6);

console.log(square.area()) // 36
```

### Call Parent ###
use `this.callParent` function to call the parent method
```javascript
var Rectangle = Class.define({

    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },

    area: function () {
        return this.width * this.height;
    }
});

var Square = Rectangle.define({

    constructor: function (side) {
        this.callParent(side, side);
    }
});

var Cube = Square.define({

    constructor: function (side) {
        this.callParent(side);

        this.side = side;
    },

    area: function () {
        return 6 * this.callParent()
    },

    volume: function () {
        return Math.pow(this.side,3);
    }
});

var cube = new Cube(5);

console.log(cube.area()) //150;
console.log(cube.volume()) //125;
```
### Statics ###
```javascript
var Rectangle = Class.define({
    $config: {
        statics: {
            MIN_SIDE: 1,
            MAX_SIDE: 150
        }
    },

    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },

    area: function () {
        return this.width * this.height;
    }
});


console.log(Rectangle.MIN_SIDE) //1;

var rectangle = new Rectangle(5, 5);
console.log(rectangle.MIN_SIDE.should.equal(1)) //1;
```
## Mixin ###
used to add protoype functions from other classes
```javascript
var Events = Class.define({
    bind: function (event, fn) {
        return true;
    },
    unbind: function (event, fn) {
        return true;
    }
});

var Rectangle = Class.define({
    $config: {
        mixins: [Events]
    },

    constructor: function (width, height) {
        this.height = height;
        this.width = width;
    },

    area: function () {
        return this.width * this.height;
    }
});

var rectangle = new Rectangle(5, 5);
rectangle.bind('test',function(){})
rectangle.unbind('test',function(){})
```
### Namespace ###
create class on the global scope global scope
```javascript
Class.define('Test.Position.Base', {

    constructor: function (symbol, amount, side) {

        this.symbol = symbol;
        this.amount = amount;
        this.side = side;
    }
});

Position.define('Test.Position.Long', {

    constructor: function (symbol, amount) {
        this.callParent( symbol, amount, 2);
    }
});

Position.define("Test.Position.Short", {

    constructor: function (symbol, amount) {

        this.callParent(symbol, amount, 2);
    }
});

var short = new Test.Position.Short();
var long = new Test.Position.Long();
```
### Contractor Name ###
you can define the class name
```javascript
var Position = Class.define({

    constructor: function (symbol, amount, side) {

        this.symbol = symbol;
        this.amount = amount;
        this.side = side;

    }
});

var Long = Position.define({
    $config: {
        name: "long"
    },

    constructor: function (symbol, amount) {
        this.callParent( symbol, amount, 2);
    }
});

var Short = Position.define({
    $config: {
        name: "short"
    },
    constructor: function (symbol, amount) {

        this.callParent(symbol, amount, 2);
    }
});


var short = new Short();
var long = new Long();

consloe.log(short.constructor.name) // short
console.log(long.constructor.name) //long;
```

## Plugins ##
you can your custom plugins to the class system by adding callback function
the function will be called with 3 `arguments`
 - `config` - config object of the class
 - `klass` - class referance
 - `parent` - parent class referance

```javascript
Class.addPlugin(function(config,klass,parent){
    //do something
});
```

## Tests ##
```javascript
    grunt test
```

## License ##

The `appolo class` library is released under the MIT license. So feel free to modify and distribute it as you wish.
