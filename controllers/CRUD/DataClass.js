const DataException = require('../../exceptions/DataException');

module.exports = class DataClass {
    constructor() {
        this.json = {};
    }

    build() {
        Object.keys(this.configuration).forEach((key) => {
            Object.defineProperty(this, key, {
                get: () => {
                    return this.json[key];
                }, 
                set: (value) => {
                    this.configuration[key].forEach((element) => { element(this, key, value); });
                    this.json[key] = value;}
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
        if(typeof value != 'string' && value != null) {
            var message = 'Attribute ' + key + ' of '
            + object.__proto__.constructor.name + ' should be a String.'
            throw new DataException(message);
        }
    }

};
