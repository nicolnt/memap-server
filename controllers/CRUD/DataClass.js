const DataException = require('../../Exceptions/DataException');

module.exports = class DataClass {
    constructor() {}

    build() {
        Object.keys(this.configuration).forEach((key) => {
            Object.defineProperty(this, key, {
                get: () => {
                    return this['_' + key]
                }, 
                set: (value) => {
                    this.configuration[key].forEach((element) => { element(this, key, value); });
                    this['_' + key] = value;}
               });
        });
    }

    hydrate(data) {     
        if(data != undefined) {
            Object.keys(data).forEach((key) => {
                if(this.configuration[key] != undefined) {
                    this[key] = data[key];
                } else {
                    console.log('non');
                    console.log(key);
                    // On crée une exception.
                }
            });
        }
    }

    get json() {  
        var object = {};   
        Object.keys(this.configuration).forEach((key) => {
            object[key] = this[key];
        });
        return object;
    }

    //Faire une methode toString.

    isNumeric(object, key, value) { 
        if(typeof value != 'number') {
            var message = 'Attribute ' + key + ' of '
            + object.__proto__.constructor.name + ' should be a number.'
            throw new DataException(message);
        }
    }

    isUnsignedNum(object, key, value) { 
        if(typeof value != 'number' && value >= 0) {
            var message = 'Attribute ' + key + ' of '
            + object.__proto__.constructor.name + ' should be a number.'
            throw new DataException(message);
        }
    }

    isString(object, key, value) { 
        if(typeof value != 'string') {
            var message = 'Attribute ' + key + ' of '
            + object.__proto__.constructor.name + ' should be a String.'
            throw new DataException(message);
        }
    }

};