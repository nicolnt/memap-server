const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const icon_model = require('../models/icon');

module.exports = {
	read: {
		entireIcon: {
			byUUID(req, res) {

				icon_model.getIconByUUID(req.params.uuid)
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

		async newIcon(req, res) {

			// TODO accept no file
			const icon_uuid = uuid.v4();
			const newIcon = {
				name: req.body.name,
				uuid: icon_uuid
			};

			if ( req.files ) {
				const file = req.files.icon.name.match(/([^\.]+)\.(?<ext>.+)/).groups;
				const newIconFilename = icon_uuid + '.' + file.ext;
				const newPathToIcon = path.join(__dirname, '../public/icons', newIconFilename);

				//if (req.body.name) file.name = req.body.name;
				newIcon.extension = file.ext;

				await req.files.icon.mv(newPathToIcon, err => {
    			if(err) res.status(500).end();
				});

			}

			icon_model.createIcon(newIcon)
				.then( icon => {
					res.status(200).send( icon );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});

		},
		rename(req, res) {

			icon_model.renameIcon(req.params.uuid, req.body.name)
				.then( icon => {
					res.status(200).send( icon );
				})
				.catch(err => {
					if (err) res.status(500).end();
				});
		}
	},
	delete(req, res) {
		icon_model.deleteIcon(req.params.uuid)
			.then( iconFileName => {
				const iconPath = path.join(__dirname, '../public/icons', iconFileName)
				if (iconFileName) fs.unlink(iconPath, err => {
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
