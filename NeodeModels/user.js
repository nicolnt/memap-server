/**
 * User Definition
 */
module.exports = {
    uuid: {
        type: 'uuid',
        primary: true,
        required: true,
        index: true
    },
    firstname: {
        type: 'string',
    },
    lastname: {
        type: 'string',
    },
    pseudo: {
        type: 'string',
    },
    pwd: {
        type: 'string',
    },
    createAt: {
        type: 'datetime',
    },
    editAt: {
        type: 'datetime',
    },
    lastConnexion: {
        type: 'datetime',
    } 
};