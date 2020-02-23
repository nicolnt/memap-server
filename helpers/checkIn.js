const DataInContentException = require('../Exceptions/DataInContentException');

module.exports = {
	require(object, fields) {
        fields.forEach(field => {
            if(!object.hasOwnProperty(field)) {
                throw new DataInContentException(object, field);
            }
        });
    }
};