var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');

describe('Property Array', function () {

    describe('inject array of objects', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },
                getNames: function () {

                    var name = ""
                    this.objects.forEach(function(object){
                        name+=object.name
                    });

                    return name;
                }

            });

            var FooManager = Class.define({

                constructor: function () {

                    this.name = 'foo';
                }


            });

            var BarManager = Class.define({

                constructor: function () {
                    this.name = 'bar';
                }

            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    properties: [
                        {
                            name: 'objects',
                            array: [
                                {ref: 'fooManager'},
                                {ref: 'barManager'}
                            ]
                        }
                    ]
                },
                fooManager: {
                    type: FooManager,
                    singleton: true

                },
                barManager: {
                    type: BarManager,
                    singleton: true

                }
            });

            injector.initialize();
        });

        it('should inject to object runtime and ref objects', function () {

            var rectangle = injector.getObject('rectangle');

            should.exist(rectangle.objects);
            rectangle.objects.should.be.an.instanceOf(Array);
            rectangle.objects.should.have.length(2);
            rectangle.getNames().should.equal('foobar');
        });
    });

});

