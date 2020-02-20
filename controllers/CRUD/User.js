const DataClass = require('./DataClass.js');
const userModel = require('../../models/user.js');

module.exports = class User extends DataClass {
    
    constructor(data) {
        super();

        this.configuration =
        {
            uuid: [],
            firstname: [this.isString],
            lastname: [this.isString],
            pseudo: [this.isString],
            pwd: [this.isString],
            dateCreated: [],
            lastConnection: [],
        }

        this.build();
        this.hydrate(data);   
    }


    /////// CRUD ////////
    static async $getByUuid(uuid) {
        return new User(await userModel.getByUuid(uuid));
    }

    static async $authentify(user) {
        userModel.authentify(new User(user));
    }

    static async $update(user) {
        return userModel.edit(user);
    }

    static async $delete(user) {
        if(user.uuid != undefined) {
            userModel.delete(user.uuid);
        } else {
            // exception
        }  
    }

    static async $create(user) {
        userModel.create(user);
    }
};