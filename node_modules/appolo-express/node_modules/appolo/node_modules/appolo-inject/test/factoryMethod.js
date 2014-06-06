var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');

describe('Property Factory Method', function () {

    describe('inject factory method', function () {
        var injector,FooManager;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },
                getName: function () {

                    return this.createFooManager();
                }

            });

            FooManager = Class.define({

                constructor: function () {
                    this.name = 'foo';
                }
            });



            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    properties: [
                        {
                            name: 'createFooManager',
                            factoryMethod: 'fooManager'
                        }
                    ]
                },
                fooManager: {
                    type: FooManager,
                    singleton: false

                }
            });

            injector.initialize();
        });

        it('should inject factory method that creates objects', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle.createFooManager);
            rectangle.getName().should.be.instanceof(FooManager);
            rectangle.createFooManager.should.be.a('Function')


        });


    });

    describe('inject factory method with args', function () {
        var injector,FooManager;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },
                getName: function (name) {

                    return this.createFooManager(name).getName();
                }

            });

            FooManager = Class.define({

                constructor: function (name) {
                    this.name = name;
                },

                getName:function(){
                    return this.name;
                }
            });



            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    properties: [
                        {
                            name: 'createFooManager',
                            factoryMethod: 'fooManager'
                        }
                    ]
                },
                fooManager: {
                    type: FooManager,
                    singleton: false
                }
            });

            injector.initialize();
        });

        it('should inject factory method that creates objects and call object with args', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle.createFooManager);

            rectangle.createFooManager.should.be.a('Function')

            rectangle.createFooManager().should.be.instanceof(FooManager);

            should.exist(rectangle.createFooManager('test').name);

            rectangle.createFooManager('test').name.should.be.equal("test");

            rectangle.getName("test2").should.be.equal("test2")
        });
    });




    describe('inject factory method with initialize init method', function () {
        var injector,FooManager;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },
                getName: function (name) {

                    return this.createFooManager(name).getName();
                }

            });

            FooManager = Class.define({

                constructor: function () {

                },

                initialize:function(){
                    this.name = Math.random();
                },

                getName:function(){
                    return this.name;
                }
            });



            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    properties: [
                        {
                            name: 'createFooManager',
                            factoryMethod: 'fooManager'
                        }
                    ]
                },
                fooManager: {
                    type: FooManager,
                    initMethod:'initialize',
                    singleton: false
                }
            });

            injector.initialize();
        });

        it('should inject factory method that creates objects and call object with initialize', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle.createFooManager);

            rectangle.createFooManager.should.be.a('Function')

            rectangle.createFooManager().should.be.instanceof(FooManager);

            should.exist(rectangle.createFooManager().name);

            var name1 = rectangle.createFooManager().getName();

            var name2 = rectangle.createFooManager().getName();

            should.exist(name1);

            should.exist(name2);

            name1.should.not.be.equal(name2)
        });
    });



});

