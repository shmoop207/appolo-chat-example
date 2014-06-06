var should = require('chai').should(),
    Class = require('appolo-class'),
    inject = require('../lib/inject');


describe('Property Ref', function () {

    describe('inject object by ref', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },

                area: function () {
                    return this.calcManager.calc();
                }
            });

            var CalcManager = Class.define({

                constructor: function () {

                },

                calc: function () {
                    return 25
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    props: [
                        {
                            name: 'calcManager',
                            ref: 'calcManager'
                        }
                    ]
                },
                calcManager: {
                    type: CalcManager,
                    singleton: true
                }
            });

            injector.initialize();
        });

        it('should inject property ', function () {

            var rectangle = injector.getObject('rectangle');
            should.exist(rectangle);
            rectangle.area().should.equal(25);

        });
    });

    describe('inject property with different name', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },

                area: function () {
                    return this.calc.calc();
                }
            });

            var CalcManager = Class.define({

                constructor: function () {

                },

                calc: function () {
                    return 25
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    props: [
                        {
                            name: 'calc',
                            ref: 'calcManager'
                        }
                    ]
                },
                calcManager: {
                    type: CalcManager,
                    singleton: true
                }
            });

            injector.initialize();
        });

        it('should inject property ', function () {

            var rectangle = injector.getObject('rectangle');
            should.exist(rectangle);
            rectangle.area().should.equal(25);

            should.not.exist(rectangle.CalcManager);

        });
    });



    describe('inject property with properties  def', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },

                area: function () {
                    return this.calc.calc();
                }
            });

            var CalcManager = Class.define({

                constructor: function () {

                },

                calc: function () {
                    return 25
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    properties: [
                        {
                            name: 'calc',
                            ref: 'calcManager'
                        }
                    ]
                },
                calcManager: {
                    type: CalcManager,
                    singleton: true
                }
            });

            injector.initialize();
        });

        it('should inject property ', function () {

            var rectangle = injector.getObject('rectangle');
            should.exist(rectangle);
            rectangle.area().should.equal(25);

            should.not.exist(rectangle.CalcManager);

        });
    });





    describe('inject property with inject array', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },

                name: function () {
                    return this.fooManager.name() + this.barManager.name()
                }
            });

            var FooManager = Class.define({

                constructor: function () {

                },

                name: function () {
                    return 'foo'
                }
            });

            var BarManager = Class.define({

                constructor: function () {

                },

                name: function () {
                    return 'bar'
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    inject: ['fooManager', 'barManager']
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

        it('should inject property with inject array', function () {

            var rectangle = injector.getObject('rectangle');
            should.exist(rectangle);
            should.exist(rectangle.fooManager);
            should.exist(rectangle.barManager);

            rectangle.name().should.equal('foobar');
        });
    });

    describe('inject property with nested properties', function () {
        var injector;

        beforeEach(function () {
            injector = inject.createContainer();

            var Rectangle = Class.define({

                constructor: function () {

                },

                name: function () {
                    return this.fooManager.name()
                }
            });

            var FooManager = Class.define({

                constructor: function () {

                },

                name: function () {
                    return 'foo' + this.barManager.name()
                }
            });

            var BarManager = Class.define({

                constructor: function () {

                },

                name: function () {
                    return 'bar'
                }
            });

            injector.addDefinitions({
                rectangle: {
                    type: Rectangle,
                    singleton: false,
                    inject: ['fooManager']
                },
                fooManager: {
                    type: FooManager,
                    singleton: true,
                    inject: ['barManager']
                },
                barManager: {
                    type: BarManager,
                    singleton: true
                }
            });

            injector.initialize();
        });

        it('should inject property with nested properties', function () {

            var rectangle = injector.getObject('rectangle');
            should.exist(rectangle);
            should.exist(rectangle.fooManager);
            should.not.exist(rectangle.barManager);
            should.exist(rectangle.fooManager.barManager);

            rectangle.name().should.equal('foobar');
        });
    });

});
