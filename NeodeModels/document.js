/**
 * Document Definition
 */
module.exports = {
    uuid: {
        type: 'uuid',
        primary: true,
        required: true,
        index: true
    },
    title: {
        type: 'string',
    },
    content: {
        type: 'string',
    }
};