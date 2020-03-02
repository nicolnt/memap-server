/**
 * Reference Definition
 */
module.exports = {
    idRef: {
        type: 'string',
        primary: true,
        required: true
    },
    uuidPage: {
        type: 'string',
        primary: true,
        required: true
    },
    url: {
        type: 'string',
        primary: true,
        required: true
    },
    cache: {
        type: 'string',
    },
    createAt: {
        type: 'datetime',
    },
    editAt: {
        type: 'datetime',
    }
};