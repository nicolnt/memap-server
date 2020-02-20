const User = require('./CRUD/User.js');

module.exports = {
	async authentify(req, res) {
		await User.$authentify(new Document(rep.body))
		res.status(200).send(data);
	},

	async create(req, res) {
		await User.$create(new Document(req.body));
		res.status(200).send({});
	},

	async edit(req, res) {
		await user.$edit(new Document(req.body))
		res.status(200).send({});
	},
			
	async delete(req, res) {
		await User.$delete(req.params.uuid)
		res.status(200).send({});
	}
};
