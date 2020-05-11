const RequireDataError = require('../exceptions/RequireDataError');

module.exports = {
	isRequire(object, fields) {
        fields.forEach(field => {
            if(!object.hasOwnProperty(field)) {
                throw new RequireDataError(field);
            }
        });
    }
};
