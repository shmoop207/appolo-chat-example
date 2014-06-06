"use strict";
var _ = require('lodash'),
    util = require('./class_util');

function define(namespace, api) {

    var config, klass, parent,
        ignoredKeys = { constructor: true, prototype: true, $config: true, callParent: true };

    if (!api) {
        api = namespace;
        namespace = null;
    }

    //get config
    config = api.$config || {};

    //get api
    api = _.isFunction(api) ? api() : api;

    namespace =  namespace || config.namespace || null;

    //set name
    config.name = config.name || (namespace && namespace.replace(/\./g,'_'))  || "";

    //get parent
    parent = config.extends || function () {};

    //create constructor if not given
    if (_.has(api, 'constructor')) {

        //add call parent to constructor
        klass = (function (supProto) {
            
            if(config.name){
                return new Function(
                    'supProto', 
                    'api', 
                    'return function ' + config.name + '() {' +
                        'this.callParent = supProto["constructor"];' +
                        'return api.constructor.apply(this, arguments);' +
                    '}'
                )(supProto, api)
            } else {
                return function () {
                    this.callParent = supProto["constructor"];
                    return api.constructor.apply(this, arguments);
                }
            }
            
             
        })(parent.prototype);
    }
    else if (config.extends) {
        //set constructor to be parent constructor
        klass = (function (parent) {
            
            if(config.name){
                return new Function(
                    'parent', 
                    'return function ' + config.name + ' () {parent.apply(this, arguments); }'
                )(parent) 
            } else {

                return function  () {
                    parent.apply(this, arguments); 
                }; 
            }

        })(parent);

    } else { //constructor to empty function

        klass =  config.name ? new Function('return function ' + config.name + ' () {}')(): function () {}
    }

    //create class prototype
    klass.prototype = Object.create(parent.prototype, {
        constructor: {
            value: klass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    //copy prototype
    _.forEach(api, function (func, name) {

        if (!ignoredKeys[name]) {

            if (!_.isFunction(func)) {
                klass.prototype[name] = func;
            } else {
                klass.prototype[name] = (function (name, func, supProto) {
                    return function () {

                        this.callParent = supProto[name];

                        try {
                            return func.apply(this, arguments);
                        } finally {
                            this.callParent = null;
                        }
                    }

                })(name, func, parent.prototype);
            }
        }
    });


    //add statics
    _.forEach(config.statics, function (func, name) {
        klass[name] = func;
        klass.prototype[name] = func;
    });

    //add mixin
    if (config.mixins) {
        _.forEach(_.isArray(config.mixins) ? config.mixins : [config.mixins], function (mixin) {

            _.forEach(mixin.prototype, function (mixinFunc, mixinName) {
                klass.prototype[mixinName] = mixinFunc;
            });
        });
    }

    //run on plugins
    _.forEach(plugins, function (func) {
        func(config, klass, parent);
    });

    //add define method for easy inheritance
    klass.define = (function (klass, define) {
        return function (namespace, api) {

            if(!api){
                api = namespace;
                namespace = null;
            }

            api.$config = api.$config || {};

            api.$config.extends = klass;

            return define(namespace, api)
        }
    })(klass, define);

    if(namespace){
       util.namespace(namespace,GLOBAL,klass);
    }


    return klass;
}

var plugins = [];

module.exports.define = define;

module.exports.addPlugin = function(func){
    plugins.push(func)
};
