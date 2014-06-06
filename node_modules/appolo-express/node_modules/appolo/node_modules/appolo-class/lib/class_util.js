module.exports={

    namespace :function(namespace, parentNamespace,value) {
        var properties = namespace.split('.');
        var go = function(parent) {
            while (properties.length) {
                var property = properties.shift();
                if (typeof parent[property] === 'undefined') {
                    parent[property] = {};
                }


                if(properties.length==0 && value){
                    parent[property] = value;
                } else {
                    parent = parent[property];
                }

            }



        };
        go(parentNamespace || (function() {
            return this;
        })());
    }
}
