const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const icon_model = require('../models/icon');

module.exports = {
	read: {
		entireIcon: {
			byIconName(req, res) {

				icon_model.getIconByName(req.params.name)
					.then(icon => {

						if (icon) res.status(200);
 						else res.send(404);

						res.send(icon);
					})
					.catch(err => {
						if (err) res.status(500).end();
					});
			}
		}
	},

	write: {

		newIcon(req, res) {
			const icon_uuid = uuid.v4();
			const file = req.files.icon.name.match(/([^\.]+)\.(?<ext>.+)/).groups;
			const newIconFilename = icon_uuid + '.' + file.ext;
			const newPathToIcon = path.join(__dirname, '../public/icons', newIconFilename);
			req.files.icon.mv(newPathToIcon, err => {
    		if(err) {
					res.status(500).end();
				}
				else {
					const newIcon = {
						name: req.body.name,
						path: newIconFilename
					};

					icon_model.createIcon(newIcon)
						.then( icon => {
							res.status(200).send( icon );
						})
						.catch(err => {
							if (err) res.status(500).end();
						});
				}
			});
		},
		edit(req, res) {

			icon_model.editIcon(req.params.name, req.body)
				.then( icon => {
					res.status(200).send( icon );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});
		}
	},
	delete(req, res) {
		icon_model.deleteIcon(req.params.name)
			.then( iconFileName => {
				const iconPath = path.join(__dirname, '../public/icons', iconFileName)
				if (path) fs.unlink(iconPath, err => {
					if (err) {
						console.log(err);
						res.status(500).end();
					}
					else {
						console.log('Icon', iconFileName, 'deleted successfully!');
						res.status(200).end();
					}
				})
				res.status(200).end();
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	}
};
