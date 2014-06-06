var should = require('chai').should(),
    Class = require('../lib/class')


describe('Class', function () {
    describe('create first class', function () {

        it('should crate class with empty constructor', function () {

            var Rectangle = Class.define({
                area: function () {
                    return 25;
                }
            });

            var rectangle = new Rectangle();
            rectangle.area().should.equal(25);

        });

        it('should crate class and not have config in prototype', function () {

            var Rectangle = Class.define({

                $config: {
                    test: 'aa'
                },

                area: function () {
                    return 25;
                }
            });

            var rectangle = new Rectangle();

            rectangle.should.not.have.property('config');

        });

        it('should crate class with constructor params and call instance function', function () {

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

            rectangle.area().should.equal(25);
        });
    });

    describe('create second class', function () {

        it('should crate class with inherits from first class', function () {

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
                    Rectangle.call(this, side, side);
                }
            });

            var square = new Square(6);

            square.area().should.equal(36);

        });
    });

    describe('create third class', function () {

        it('should crate class inherits from second class and call parent', function () {

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
                    this.callParent(side, side);
                }
            });


            var Cube = Class.define({

                $config: {
                    extends: Square
                },

                constructor: function (side) {
                    this.callParent(side);

                    this.side = side;
                },

                area: function () {
                    return 6 * this.callParent()
                },

                volume: function () {
                    return this.side * 5 * 5;
                }
            });

            var cube = new Cube(5);

            cube.area().should.equal(150);
            cube.volume().should.equal(125);
        });
    });


    describe('create third class call parent methods test', function () {

        it('should parents methods', function () {

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

                    this.multi = 2;

                    this.callParent(side, side);


                },

                area: function () {

                    return  this.multi * this.callParent()
                }
            });


            var Cube = Class.define({

                $config: {
                    extends: Square
                },

                constructor: function (side) {
                    this.callParent(side);

                    this.side = side;
                },

                area: function () {
                    return 6 * this.callParent()
                },

                volume: function () {
                    return this.side * 5 * 5 * this.multi;
                }
            });

            var cube = new Cube(5);

            cube.area().should.equal(300);
            cube.volume().should.equal(250);
        });
    });

    describe('create class with statics', function () {

        it('should crate class with statics', function () {

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


            Rectangle.MIN_SIDE.should.equal(1);

            var rectangle = new Rectangle(5, 5);
            rectangle.MIN_SIDE.should.equal(1);
        });
    });

    describe('create class with mixin', function () {

        it('should crate class with mixin', function () {

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
            rectangle.bind().should.true;
            rectangle.unbind().should.true;
        });
    });

    describe('create  class with empty  constructor and call parent constructor', function () {
        it('should call parent constructor ', function () {

            var Events = Class.define({

                constructor: function (name) {

                    this.name = name || "events";

                },

                bind: function (event, fn) {
                    return true;
                },
                unbind: function (event, fn) {
                    return true;
                }
            });

            var Rectangle1 = Class.define({
                $config: {
                    extends: Events
                },


                area: function () {

                    return 1;
                }
            });

            var rectangle1 = new Rectangle1();

            rectangle1.name.should.equal("events");

        });
    });


    describe('create 2 class with overrides', function () {

        it('should crate 2 class without overrides', function () {

            var Events = Class.define({

                constructor: function (name) {

                    this.name = name || "events";

                },

                bind: function (event, fn) {
                    return true;
                },
                unbind: function (event, fn) {
                    return true;
                }
            });

            var Rectangle1 = Class.define({
                $config: {
                    extends: Events
                },


                area: function () {

                    return 1;
                }
            });

            var Rectangle2 = Class.define({
                $config: {
                    extends: Events
                },

                constructor: function () {

                    this.callParent('rectangle2');

                },

                area: function () {
                    return 2;
                }

            });

            var rectangle1 = new Rectangle1();
            var rectangle2 = new Rectangle2();

            rectangle1.name.should.equal("events");

            rectangle2.name.should.equal("rectangle2");

            rectangle1.area().should.equal(1);
            rectangle2.area().should.equal(2);

        });
    });

    describe('create from parent define', function () {
        it('should create class from parent define', function () {
            var Events = Class.define({

                constructor: function (name) {

                    this.name = name || "events";

                },

                bind: function (event, fn) {
                    return true;
                },
                unbind: function (event, fn) {
                    return true;
                }
            });

            var Rectangle = Events.define({

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;

                    this.callParent();
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var rectangle = new Rectangle(5, 5);
            rectangle.bind().should.true;
            rectangle.unbind().should.true;
            rectangle.name.should.equal("events");
        });
    });


    describe('create 2 classes from inherit', function () {
        it('should 2 different classes', function () {

            var Position = Class.define({

                constructor: function (symbol, amount, side) {

                    this.symbol = symbol;
                    this.amount = amount;
                    this.side = side;

                }
            });

            var Long = Position.define({

                constructor: function (symbol, amount) {
                    this.callParent(symbol, amount, 2);
                }
            });

            var Short = Position.define({

                constructor: function (symbol, amount) {

                    this.callParent(symbol, amount, 2);
                }
            });


            var long = new Long("AAPL", 5);
            var short = new Short("GOOG", 2);


            long.symbol.should.equal("AAPL");
            short.symbol.should.equal("GOOG");

            long.amount.should.equal(5);
            short.amount.should.equal(2);
        });
    });


    describe('namespace', function () {
        it('should create namespace and constractor name', function () {

            var Position = Class.define('Test.Position.Base', {

                constructor: function (symbol, amount, side) {

                    this.symbol = symbol;
                    this.amount = amount;
                    this.side = side;

                }
            });

            var Long = Position.define('Test.Position.Long', {

                constructor: function (symbol, amount) {
                    this.callParent( symbol, amount, 2);
                }
            });

            var Short = Position.define("Test.Position.Short", {

                constructor: function (symbol, amount) {

                    this.callParent(symbol, amount, 2);
                }
            });

            should.exist(Test.Position.Short);
            should.exist(Test.Position.Long);

            var short = new Test.Position.Short();
            var long = new Test.Position.Long();

            short.constructor.name.should.equal("Test_Position_Short");
            long.constructor.name.should.equal("Test_Position_Long");

            GLOBAL.Test.Position.Short =null;
            GLOBAL.Test.Position.Long =null;
        });


        it('should have contractor name', function () {

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

            short.constructor.name.should.equal("short");
            long.constructor.name.should.equal("long");
        });

        it('should have create namespace from config and contractor name', function () {

            var Position = Class.define({

                constructor: function (symbol, amount, side) {

                    this.symbol = symbol;
                    this.amount = amount;
                    this.side = side;

                }
            });

            var Long = Position.define({
                $config: {
                    name: "long",
                    namespace:'Test.Position.Long'
                },

                constructor: function (symbol, amount) {
                    this.callParent( symbol, amount, 2);
                }
            });

            var Short = Position.define({
                $config: {
                    name: "short",
                    namespace:'Test.Position.Short'
                },
                constructor: function (symbol, amount) {

                    this.callParent(symbol, amount, 2);
                }
            });

            var short = new Test.Position.Short();
            var long = new Long();

            short.constructor.name.should.equal("short");
            long.constructor.name.should.equal("long");

            GLOBAL.Test.Position.Short =null;
            GLOBAL.Test.Position.Long =null;
        });

    });


});