var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');

describe('Singleton',function(){


    describe('create singleton object', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {
                    this.number = Math.random();
                },

                area: function () {
                    return 25;
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: true
                }
            });

            injector.initialize();
        });

        it('should save object in instances', function () {
            should.exist(injector.getInstances()['rectangle']);
        });

        it('should get object', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle);
            rectangle.area().should.equal(25);
        });

        it('should have the same instance ', function () {

            var rectangle = injector.getObject('rectangle');
            var number = rectangle.number;
            var rectangle2 = injector.getObject('rectangle');

            number.should.equal(rectangle2.number);

        });
    });

    describe('create not singleton object', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {
                    this.number = Math.random();
                },

                area: function () {
                    return 25;
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false
                }
            });

            injector.initialize();
        });

        it('should save object in instances', function () {
            should.not.exist(injector.getInstances()['rectangle']);
        });

        it('should get object', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle);
            rectangle.area().should.equal(25);
        });

        it('should have the same instance ', function () {

            var rectangle = injector.getObject('rectangle');
            var number = rectangle.number;
            var rectangle2 = injector.getObject('rectangle');

            number.should.not.equal(rectangle2.number);

        });
    });



});

