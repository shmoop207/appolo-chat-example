var Class = require('appolo-class'),
    _ = require('lodash');

module.exports = Class.define({

    on: function (event, fn,scope) {

        if (!this._eventDispacherCallbacks) {
            this._eventDispacherCallbacks = {};
        }

        var callbacks = this._eventDispacherCallbacks[event];

        if(!callbacks){
            this._eventDispacherCallbacks[event] = callbacks = [];
        }

        callbacks.push({
            fn:fn,
            scope:(scope || this)
        });

        return this;
    },

    un: function (event, fn,scope) {

        if (this._eventDispacherCallbacks) {

            var callbacks = this._eventDispacherCallbacks[event];

            if (callbacks && callbacks.length > 0) {

                _.remove(callbacks, function(callback) {
                    return callback.fn === fn && callback.scope === (scope || this);
                },this);
            }
        }

        return this;
    },

    fireEvent :function (event){

        if (this._eventDispacherCallbacks) {
            var args = Array.prototype.slice.call(arguments, 1)
                , callbacks = this._eventDispacherCallbacks[event];

            if (callbacks) {
                callbacks = _.clone(callbacks); // to handle the case of un during the fire event

                _.forEach(callbacks,function(callback){
                    if(callback && callback.fn && callback.scope){
                        callback.fn.apply((callback.scope || this), args);
                    }
                },this)
            }
        }

        return this;
    }
});
