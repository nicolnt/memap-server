const User = require('../CRUD/User.js');
const checkIn = require('../../helpers/checkIn');

module.exports = {
	async authentify(req, res) {
		checkIn.isRequire(req.body, ['login', 'pwd']);
		await User.$authentify(new User(rep.body))
		res.status(200).send({});
	},

	async getById(req, res) {
		res.status(200).send({
			user: await User.$getByUuid(rep.params.uuid)
		});
	},

	async get(req, res) {
		//await User.$get(new Document(rep.params.id))
		res.status(200).send({});
	},

	async create(req, res) {
		checkIn.isRequire(req.body, ['login', 'pwd']);
		await User.$create(new User(req.body));
		res.status(200).send({});
	},

	async edit(req, res) {
		checkIn.isRequire(req.body, ['login', 'pwd', 'oldpwd']);
		await user.$edit(new User(req.body))
		res.status(200).send({});
	},
			
	async delete(req, res) {
		await User.$delete(req.params.uuid)
		res.status(200).send({});
	}
};
