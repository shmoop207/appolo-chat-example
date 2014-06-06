var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');


describe('Ioc', function () {
    describe('create ioc', function () {

        it('should crate empty Ioc', function () {
            var injector = inject.createContainer();

            should.exist(injector.getInstances());
        });

        it('should add add definitions', function () {
            var injector = inject.createContainer();

            injector.addDefinitions({
                test: {
                    type: 'test'
                }
            });

            should.exist(injector.getDefinition('test'));
        });

        xit('should add duplicate definitions', function () {
            var injector = inject.createContainer();


            (function () {

                injector.addDefinitions({
                    test: {
                        type: 'test'
                    }
                });

                injector.addDefinitions({
                    test: {
                        type: 'test'
                    }
                })
            }).should.throw("Injector:definition id already exists:test")
        });
    });

    describe('get simple object', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle
                }
            });

            injector.initialize();
        });


        it('should get object', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle);
        });
    });

    describe('get simple object error', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle
                }
            });

            injector.initialize();
        });


        it('should throw error if object not found', function () {

            (function () {
                var rectangle = injector.getObject('rectangle2');
            }).should.throw("Injector:can't find object definition for objectID:rectangle2")


        });
    });


    describe('reset ioc', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle
                }
            });

            injector.initialize();
        });


        it('should reset ioc', function () {


            should.exist(injector.getDefinition('rectangle'));
            should.exist(injector.getObject('rectangle'));

            injector.reset();
            should.not.exist(injector.getDefinition('rectangle'));
            (function () {
                var rectangle = injector.getObject('rectangle');
            }).should.throw()

        });
    });

    describe('add object', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();


            injector.initialize();
        });


        it('should add object', function () {

            function Test() {
            }

            injector.addObject('test', new Test());

            var test = injector.getObject('test');

            should.exist(test);

            test.should.be.an.instanceOf(Test)

        });
    });

    describe('get object by type', function () {
        var injector, Rectangle, Circle;

        beforeEach(function () {
            injector = inject.createContainer();

            Rectangle = Class.define({

                constructor: function () {

                }
            });

            Circle = Class.define({

                constructor: function () {

                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton:true
                }
            });

            injector.addDefinitions({
                circle: {
                    type: Circle,
                    singleton:true
                }
            });

            injector.initialize();
        });

        it('should get by type', function () {

            var objects= injector.getObjectsByType(Rectangle);

            objects.should.be.instanceof(Array).and.have.lengthOf(1);

            objects[0].should.be.instanceof(Rectangle);
        });
    });


});