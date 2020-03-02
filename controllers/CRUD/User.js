const DataClass = require('./DataClass.js');
const db = require('../../models/neode.js');

module.exports = class User extends DataClass {
    /////// Database label ////////
    static label = 'User'

    /////// Configuration ////////
    constructor(data) {
        super(data,
            {
                uuid: [],
                firstname: ['isString'],
                lastname: ['isString'],
                pseudo: ['isString'],
                pwd: ['isString'],
                createAt: [],
                editAt: [],
                lastConnection: [],
            });
    }

    /////// CRUD ////////
    //static async $authentify(user) {userModel.authentify(new User(user));} A REFAIRE

    static $getByUuid = async (uuid) => (await db.find(this.label, uuid)).properties()

    static $create = async (user) => await db.create(this.label, {...user.json, createAt:new Date})

    static $update = async (user) => await db.merge(this.label, {...user.json, editAt:new Date})

    static $delete = async (user) => (await db.find(this.label, user.uuid)).delete()
};