const user_model = require('../models/user');

module.exports = {
	read: {
		authentify(req, res) {
			console.log(req.body)
			user_model.authentify(req.body.login, req.body.pwd)
					.then(data => {
						if (data) res.status(200);
 						else res.send(404);
						res.send(data);
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
		}
	},
	write: {
		user: {
			addUser(req, res) {
				user_model.createUser(req.body)
					.then(() => {	
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
			},

			editPwd(req, res) {
				user_model.editUserPwd(req.body.uuid, req.body.pwd)
					.then(() => {	
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
			},
			
			delete(req, res) {
					user_model.deleteUser(req.params.uuid)
					.then(() => {	
						res.status(200).send({});
					})
					.catch(err => {
						if (err) res.status(500).send(err);
						res.end();
					});
			}
		}
	}
};
