Appolo Inject
=======
[Dependency Injection][1] framework for nodejs.
works best with [appolo-class][2] system but can be used as standalone.

## Installation ##
```javascript
npm install appolo-inject --save
```

## Usage ##
### Creating injection container ###
```javascript
 var inject = require('appolo-inject');
 
 var injector = inject.createContainer();

injector.addDefinitions({...});

injector.initialize();

```

### Add Definitions to injecor ###
the definition object key is used for object class id.
```javascript
var Class = require('appolo-class');
 var inject = require('appolo-inject');
 
 var injector = inject.createContainer();

var FooController = Class.define({
    constructor: function () {
    
    }
});

injector.addDefinitions({
    fooController: {
        type: FooController
    }
});

injector.initialize();

//get fooController instance from the injector
var fooController = injector.getObject('fooController');

```
###Appolo Class Plugin###
In the following examples we will use `appolo-class` plugin to add `definitions`.
it will call `addDefinitions` with `$config` object when the class is defined or required. 
you need to call `inject.useAppoloClass` only once.
```javascript
var inject = require('appolo-inject'),
    Class = require('appolo-class');

var injector = inject.createContainer();

//add appolo class and the injector to inject plugin
inject.useAppoloClass(Class,injector);

//define your classes
var FooController = Class.define({
    $config:{
        id:'fooController'
    },
    constructor: function () {
    
    },
    ...
});

//Call injector.initialize() and your ready to go
injector.initialize();

//get fooController instance from the injector
var fooController = injector.getObject('fooController');
```
### Get Object###
get object from the injector if the object is not singleton you will get new instance every time.
```javascript
Class.define({
    $config:{
        id:'fooController',
        singleton: true
    },
    constructor: function () {

    },
    ...
});

var fooController = injector.getObject('fooController');
var fooController2 = injector.getObject('fooController');

console.log(fooController === fooController2) // false

```

### Singleton###
the class will be created only once and `getObject` will return the same instance every time.
```javascript
Class.define({
    $config:{
        id:'fooController',
        singleton: true
    },
    constructor: function () {
    
    },
    ...
});

var fooController = injector.getObject('fooController');
var fooController2 = injector.getObject('fooController');

console.log(fooController === fooController2) // true

```

### Inject Property Instance###
`inject` will try in inject object id to the same property name.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true
    },
    name: function () {
        return 'foo'
    }
});

Class.define({
     $config:{
        id:'barManager',
        singleton: true
    },
    name: function () {
        return 'bar'
    }
});

Class.define({
    $config:{
        id:'buzzController',
        inject: ['fooManager', 'barManager']
    },
    name: function () {
        return this.fooManager.name() + this.barManager.name()
    }
});
....

 var buzzController = injector.getObject('buzzController');
 console.log(buzzController.name()) // foobar 

```

### Inject Property Referance By Name###
you can set the name of the property the object will be injected to.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true
    },
    name: function () {
        return 'foo'
    }
});

Class.define({
     $config:{
        id:'barManager',
        singleton: true
    },
    name: function () {
        return 'bar'
    }
});

Class.define({
    $config:{
        id:'buzzController',
         properties: [{
            name: 'foo',
            ref: 'fooManager'
        },{
            name: 'bar',
            ref: 'barManager'
        }]
    },
    name: function () {
        return this.foo.name() + this.bar.name()
    }
});

....

 var buzzController = injector.getObject('buzzController');
 console.log(buzzController.name()) // foobar 

```

### Inject Property Value ###
you can inject any value to object propery.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true,
        properties: [{
            name: 'name',
            value: 'foo'
        }
    },
    name: function () {
        return this.name;
    }
});

Class.define({
    $config:{
        id:'buzzController',
         properties: [{
            name: 'foo',
            ref: 'fooManager'
        }]
    },
    name: function () {
        return this.foo.name()
    }
});
....
 
 var buzzController = injector.getObject('buzzController');
 console.log(buzzController.name()) // foo 

```

### Inject Constructor Arguments ###
you can inject objects to constructor arguments you can inject object instance by id or by value.
it is not recommended to inject objects to constructor because you can easily get circular reference.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true,
        properties: [{
            name: 'name',
            value: 'foo'
        }
    },
    name: function () {
        return this.name;
    }
});

Class.define({
    $config:{
        id:'buzzController',
         args: [{
            ref: 'fooManager'
        },{
            value:'buzz'
        }]
    },
     constructor: function (fooManager,name) {
        this.fooManager = fooManager;
        this.name = name;
    },
    name: function () {
        return this.name + this.foo.name()
    }
});
....

 var buzzController = injector.getObject('buzzController');
 console.log(buzzController.name()) // buzzfoo 

```
you can also pass runtime arguments to `getObject` function
```javascript
Class.define({
    $config:{
        id:'buzzController',
         args: [{
            value:'buzz'
        }]
    },
     constructor: function (name,name2) {
        this.name = name;
        this.name2 = name2;
    },
    name: function () {
        return this.name + this.name2
    }
});

var buzzController = injector.getObject('buzzController',['foo']);
console.log(buzzController.name()) // buzzfoo 
```

### Inject Property Array###
you can inject `array` of properties by `refernce` or by `value`.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true
    },
    name: function () {
        return 'foo'
    }
});

Class.define({
     $config:{
        id:'barManager',
        singleton: true
    },
    name: function () {
        return 'bar'
    }
});

Class.define({
    $config:{
        id:'buzzController',
        properties: [{
            name: 'objects',
            array: [{
                ref: 'fooManager'
            },{
                ref: 'barManager'
            }]
        }]
    },
    name: function () {
        this.objects.forEach(function(obj){
            console.log(obj.getName())
        });   
    }
});
....

 var buzzController = injector.getObject('buzzController');
 buzzController.name() // foo bar 

```

### Inject Property Dictionary###
you can inject `dictionary` of properties by `refernce` or by `value`.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true
    },
    name: function () {
        return 'foo'
    }
});

Class.define({
     $config:{
        id:'barManager',
        singleton: true
    },
    name: function () {
        return 'bar'
    }
});

Class.define({
    $config:{
        id:'buzzController',
        properties: [{
            name: 'objects',
            dictionary: [
                {key:'foo',ref: 'fooManager'},
                {key:'bar',ref: 'barManager'},
                {key:'baz',value: 'baz'}
            ]
        }]
    },
    name: function () {
        return this.objects.foo.name() + this.objects.bar.name() + this.objects.baz;
    }
});
....

 var buzzController = injector.getObject('buzzController');
 buzzController.name() // foobarbaz 

```

### Inject Property From Object Property###
you can inject property from other object property.
```javascript
Class.define({
    $config:{
        id:'fooManager',
        singleton: true
    },
    constructor: function () {
        this.name = 'foo';
    }
});

Class.define({
    $config:{
        id:'buzzController',
        properties: [{
            name: 'otherObjectProperty',
            objectProperty: {
                object:'fooManager',
                property:'name'
            }
        }]
    },
    name: function () {
        return return this.otherObjectProperty;
    }
});
....

 var buzzController = injector.getObject('buzzController');
 buzzController.name() // foo
```

### Inject Property From Factory Object###
factory object must have implement `get` method witch will be called in order to inject the object instance.
```javascript
Class.define({
    $config:{
        id:'barManager',
        singleton: true
    },
    name:function(){
        return 'bar'; 
    }
});

Class.define({
    $config:{
        id:'fooFactory',
        singleton: true,
        inject: ['barManager']
    },
    get: function () {
        return this.barManager;
    }
});

Class.define({
    $config:{
        id:'buzzController',
        properties: [{
            name: 'manager',
            factory: 'fooFactory'
        }]
    },
    name: function () {
        return this.manager.name();
    }
});
....

 var buzzController = injector.getObject('buzzController');
 buzzController.name() // bar 

```

### Inject Factory Method###
factory method is a function that will return the injected object.
this is usefull the create many instances of the same class.
```javascript
Class.define({
    $config:{
        id:'person'
    },
    constructor: function (name) {
        this.name = name;
    },
    name:function(){
        return this.name; 
    }
});

Class.define({
    $config:{
        id:'fooController',
        properties: [{
            name: 'createPerson',
            factoryMethod: 'person'
        }]
    },
    name: function () {
        return this.createPerson('foo').name();
    }
});
....
 var buzzController = injector.getObject('buzzController');
 buzzController.name() // foo 

```

### Init Method###
The `init method` will be called after all instances were created and all the properties injected.
```javascript
Class.define({
    $config:{
        id:'fooManager'
    },
    name:function(){
        return 'foo'; 
    }
});

Class.define({
    $config:{
        id:'fooController',
        initMethod:'initialize',
        inject:['fooManager']
    },
    initialize:function(){
        this.name = this.fooManager.name()
    }
    
    name: function () {
        return this.name
    }
});
....

 var fooController = injector.getObject('fooController');
 fooController.name() // foo 

```
### Injector Aware ###
you can get reference to the injector container by adding `injectorAware` the injector will be injected to `$injector` property.

```javascript

Class.define({
    $config:{
        id:'fooController',
       injectorAware:true
    },
    initialize:function(){
        this.$injector.getObject('foo')
    }
});
....

```

### Alias ###
you can add alias names to classes and get all the classes by single alias

```javascript

Class.define({
    $config:{
        id:'fooManager',
        singleton: true,
        alias:['nameable']
    },
    name:function(){
        return 'foo'
    }
});

Class.define({
    $config:{
        id:'barManager',
        singleton: true,
        alias:['nameable']
    },
    name:function(){
        return 'bar'
    }
});

Class.define({
    $config:{
        id:'buzzController',
        singleton: true,
        props: [{
            name: 'nameableObjects',
            alias: 'nameable'
        }]
    },
    name:function(){
       this.nameableObjects.forEach(function(obj){
            console.log(obj.name())
        });  
    }
});

var buzzController = injector.getObject('buzzController');
 buzzController.name() // foobar 

....

```



## Tests ##
```javascript
    grunt test
```

## License ##

The `appolo inject` library is released under the MIT license. So feel free to modify and distribute it as you wish.


  [1]: http://en.wikipedia.org/wiki/Dependency_injection
  [2]: https://github.com/shmoop207/appolo-class
