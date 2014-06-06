var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');

describe('Constructor Args',function(){


    describe('inject value  to constructor', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function (size) {
                    this.size = size;
                },

                area: function () {
                    return this.size;
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: true,
                    args:[{
                        value:25
                    }]
                }
            });

            injector.initialize();
        });

        it('should have the injected value', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle.size);

            rectangle.area().should.equal(25);

        });
    });

    describe('inject value  to constructor', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function (size,name) {
                    this.size = size;
                    this.name = name;
                },

                area: function () {
                    return this.size;
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    args:[{
                        value:25
                    }]
                }
            });

            injector.initialize();
        });

        it('should have the injected value null', function () {

            var rectangle = injector.getObject('rectangle',[null]);

            should.exist(rectangle.size);
            should.not.exist(rectangle.name);

            rectangle.area().should.equal(25);


        });

        it('should have the injected value and runtime value', function () {

            var rectangle = injector.getObject('rectangle',['foo']);

            should.exist(rectangle.size);
            should.exist(rectangle.name);

            rectangle.area().should.equal(25);
            rectangle.name.should.equal('foo');

        });

    });


    describe('inject object  to constructor with runtime', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function (fooManager,name) {
                    this.fooManager = fooManager;
                    this.name = name+ this.fooManager.name;
                }
            });

            var FooManager = Class.define({

                constructor: function (name,barManager) {

                    this.barManager = barManager;

                    this.name = name+ this.barManager.name;
                }


            });

            var BarManager = Class.define({

                constructor: function (name) {
                    this.name = name;
                }

            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    args:[{
                        ref:'fooManager'
                    }]
                },
                fooManager: {
                    type: FooManager,
                    singleton: true,
                    args:[{
                        value:'foo'
                    },{
                        ref:'barManager'
                    }]
                },
                barManager: {
                    type: BarManager,
                    singleton: true,
                    args:[{
                        value:'bar'
                    }]
                }
            });

            injector.initialize();
        });

        it('should inject to object runtime and ref objects', function () {

            var rectangle = injector.getObject('rectangle',['rectangle']);

            should.exist(rectangle.fooManager);
            should.exist(rectangle.fooManager.barManager);
            rectangle.name.should.equal('rectanglefoobar');
        });
    });

});

