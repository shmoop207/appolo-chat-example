var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');

describe('Property Object Property.js', function () {

    describe('inject property from object property', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },
                getName: function () {

                    return this.otherObjectProperty;
                }

            });

            var FooManager = Class.define({

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
                            name: 'otherObjectProperty',
                            objectProperty: {
                                object:'fooManager',
                                property:'name'
                            }
                        }
                    ]
                },
                fooManager: {
                    type: FooManager,
                    singleton: true

                }
            });

            injector.initialize();
        });

        it('should inject to object runtime and ref objects', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle.otherObjectProperty);

            rectangle.getName().should.equal('foo');
        });
    });

});

