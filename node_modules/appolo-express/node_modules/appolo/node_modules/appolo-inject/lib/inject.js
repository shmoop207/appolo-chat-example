"use strict";

var _ = require('lodash'),
    path = require('path'),
    Class = require('appolo-class');


var Injector = Class.define({

    constructor: function () {
        this._instances = {};
        this._definitions = {};
        this._options = {};
        this._factories = [];
        this._alias = {};
    },

    /*
     * public  loads the context by given definitions object
     */
    initialize: function (options) {
        this._options = options || {};

        _.extend(this._definitions, this._options.definitions);

        this._wireObjects(this._definitions);
    },

    /*
     * public get object by object Id
     */
    getObject: function (objectID, runtimeArgs, ignoreFactory) {

        if (this._definitions[objectID + "Factory"] && !ignoreFactory) { //check if we have factory and it's not ignored
            return this.getObject(objectID + "Factory").get();
        }

        var instance = this._instances[objectID];

        if (!instance) {

            instance = this._createObjectInstance(objectID, this._definitions[objectID], runtimeArgs);
        }

        return instance;
    },

    addDefinitions: function (definitions) {


        _.forEach(definitions, function (value, key) {

            if (this._definitions[key]) {
                console.log("Injector:definition id already exists overriding: " + key);
            }

            this._definitions[key] = value;


        }.bind(this));

    },

    addObject: function (objectId, instance) {
        if (!this._instances[objectId]) {
            this._instances[objectId] = instance;
        } else {
            throw new Error("Injector:object id already exists:" + objectId);
        }
    },

    getObjectsByType: function (type) {
        var arr = [], objectID;

        for (objectID in this._instances) {
            if (this._instances.hasOwnProperty(objectID)) {

                if (this._instances[objectID] instanceof type) {
                    arr.push(this._instances[objectID]);
                }
            }
        }

        return arr;
    },

    getInstances: function () {
        return this._instances;
    },

    getDefinitions: function () {
        return this._definitions;
    },

    getDefinition: function (id) {
        return this._definitions[id];
    },

    getAlias: function (aliasName) {
        return this._alias[aliasName] || [];
    },

    reset: function () {

        this._instances = {};

        this._definitions = {};

        this._options = {};
        
        this._alias = {};

        this._factories.length = 0;
    },


    _createObjectInstance: function (objectID, objectDefinition, runtimeArgs) {
        var argumentInstances = [],
            commands = [],
            args = [],
            i = 0,
            j = 0,
            newObjectInstance,
            Func,
            arg,
            argValue;

        //checks if we have a valid object definition
        if (!objectDefinition) {
            throw new Error("Injector:can't find object definition for objectID:" + objectID);
        }

        newObjectInstance = this._instances[objectID];

        //	If the instance does not already exist make it
        if (!newObjectInstance) {
            args = objectDefinition.args || [];
            //add runtime args to the end of args obj
            if (runtimeArgs) {
                for (i = 0; i < runtimeArgs.length; i++) {
                    args.push({value: runtimeArgs[i]});
                }
            }

            //loop over args and get the arg value or create arg object instance
            for (i = 0; i < args.length; i++) {
                arg = args[i];

                //if we have arg references to another object we will try to create it
                argValue = _.has(arg,'value') ? arg.value : this._createObjectInstance(arg.ref, this._definitions[arg.ref]);

                //push arg value
                argumentInstances[i] = argValue;

                //store the arg array ref for the eval func
                commands[commands.length] = "argumentInstances[" + i + "]";
            }

            //crate object instance
            try {

                if (typeof objectDefinition.type === 'function') {

                    eval("newObjectInstance = new objectDefinition.type (" + commands.join(",") + ")");

                } else if (objectDefinition.path) {

                    eval("newObjectInstance = new require( path.join(this._options.root, objectDefinition.path + '.js')) (" + commands.join(",") + ")");

                } else if (objectDefinition.type === 'string') {

                    eval("newObjectInstance = new " + objectDefinition.type + " (" + commands.join(",") + ")");

                } else {

                    throw new Error("can't find valid type");
                }

            } catch (e) {
                throw new Error("Injector failed to create object objectID:" + objectID + "' \n" + e);
            }


            if (objectDefinition.singleton && objectDefinition.lazy) {

                this._wireObjectInstance(newObjectInstance, objectDefinition, objectID);
                this._instances[objectID] = newObjectInstance;

            } else if (objectDefinition.singleton) {

                this._instances[objectID] = newObjectInstance;

            } else {

                this._wireObjectInstance(newObjectInstance, objectDefinition, objectID);
            }
        }

        return newObjectInstance;
    },


    /*
     * private creates new objects instances and inject properties
     */
    _wireObjects: function (definitions) {

        _.forEach(definitions, function (definition, objectId) {
            if (definition.singleton && !definition.lazy) {
                this._createObjectInstance(objectId, definition);
            }
        }, this);

        //loop over instances and inject properties and look up methods
        _.forEach(this._instances, function (instance, objectId) {

            if (definitions[objectId]) {
                this._injectPropertiesAndLookUpMethods(instance, definitions[objectId], objectId);
            }

        }, this);

        _.forEach(this._instances, function (instance, objectId) {
            this._injectFactoryObject(instance, objectId);

            if (definitions[objectId]) {
                    _.forEach(definitions[objectId].properties, this._injectAlias.bind(this, instance, objectId));
                }

        }, this);

        //loop instances and invoke init methods
        _.forEach(this._instances, function (instance, objectId) {

            if (definitions[objectId]) {
                this._invokeInitMethod(instance, definitions[objectId]);
            }
        }, this);
    },

    /*
     * invoke the init method of given object
     */
    _invokeInitMethod: function (object, definition) {
        if (definition.initMethod && !definition.$isWired) {
            object[definition.initMethod]();
        }
    },

    _injectAlias:function(instance, objectId,prop){

        if(prop.alias){
            instance[prop.name] = this.getAlias(prop.alias)
        }
    },

    _injectFactoryObject: function (object, objectId) {

        var factoryData = this._factories[objectId];

        if (factoryData) {
            _.forEach(factoryData, function (factory, propName) {

                var factory = this.getObject(factory);

                object[propName] = factory.get();

            }, this);
        }
    },

    /*
     * private inject values and look up methods to object properties
     */
    _injectPropertiesAndLookUpMethods: function (object, objectDefinition, objectId) {
        var prop,
            i = 0,
            j = 0,
            length,
            propObj,
            injectObject,
            obj,
            factoryRef;

        var properties = objectDefinition.props || objectDefinition.properties || [];

        if(!objectDefinition.$propertiesGenerated){

            if (objectDefinition.inject) {
                for (i = 0, length = objectDefinition.inject.length; i < length; i++) {
                    properties.push({
                        name: objectDefinition.inject[i],
                        ref: objectDefinition.inject[i]
                    });
                }
            }

            objectDefinition.properties = properties;

            objectDefinition.$propertiesGenerated = true;
        }

        //loop over the properties definition
        for (i = 0, length = properties.length; i < length; i++) {

            //get property obj
            prop = properties[i];
            injectObject = null;
            factoryRef = prop.ref + "Factory";

            if (prop.array) {
                injectObject = [];

                for (j = 0; j < prop.array.length; j++) {
                    propObj = prop.array[j];
                    injectObject.push(propObj.value || this.getObject(propObj.ref));
                }
            } else if (prop.dictionary) {
                injectObject = {};

                for (j = 0; j < prop.dictionary.length; j++) {
                    propObj = prop.dictionary[j];
                    injectObject[propObj.key] = propObj.value || this.getObject(propObj.ref);
                }
            } else if (prop.value) {

                injectObject = prop.value;

            } else if (prop.ref && !this._definitions[factoryRef]) { //check if we have ref and we don't have factory with the same name

                injectObject = this.getObject(prop.ref);

            } else if (prop.objectProperty) {
                obj = this.getObject(prop.objectProperty.object);

                injectObject = obj[prop.objectProperty.property];

            } else if (prop.factory || this._definitions[factoryRef]) {

                if (factoryRef == objectId) {  //check if we trying  to inject to factory with the same name

                    injectObject = this.getObject(prop.ref, [], true);

                } else {

                    var factoryName = prop.factory || factoryRef;

                    if (!this._factories[objectId]) {
                        this._factories[objectId] = {};
                    }

                    this._factories[objectId][prop.name] = factoryName;
                }

            } else if (prop.factoryMethod) {

                injectObject = this._createDelegate(this.getObject, this, [prop.factoryMethod])
            }

            if (injectObject) {
                object[prop.name] = injectObject;
            }
        }

        if (objectDefinition.injectorAware) {
            object.$injector = this;
        }

        if (objectDefinition.alias && objectDefinition.singleton) {
            _.forEach(objectDefinition.alias, function (aliasName) {
                var arr = (this._alias[aliasName]) || (this._alias[aliasName] = []);

                arr.push(object);
            }, this);
        }

    },

    /*
     * private  fire single object instance
     */
    _wireObjectInstance: function (object, definition, objectId) {

        //inject properties  and look up methods
        this._injectPropertiesAndLookUpMethods(object, definition, objectId);

        this._injectFactoryObject(object, objectId);

        _.forEach(definition.properties,this._injectAlias.bind(this,object, objectId));

        //invoke init method
        this._invokeInitMethod(object, definition);

        definition.singleton &&  (definition.$isWired = true);
    },

    _createDelegate: function (fn, obj, args) {
        return function () {

            var callArgs = (args || []).concat(arguments);

            return fn.apply(obj, callArgs);
        };
    },

    _getMethodName: function (str) {

        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});


module.exports.createContainer = function () {
    return new Injector();
}

module.exports.useAppoloClass = function (appoloClass,injector) {

    appoloClass.addPlugin(function(config,klass,parent){
        var id = config.id || config.namespace,
            def = {};

        if (id) {
            def[id] = {
                singleton:config.singleton,
                initMethod:config.initMethod,
                props:config.properties,
                type:klass,
                args:config.args,
                inject:config.inject,
                lazy:config.lazy,
                injectorAware:config.injectorAware,
                alias: config.alias
            };

            injector.addDefinitions(def);
        }
    })
}
