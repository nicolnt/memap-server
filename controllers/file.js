const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const file_model = require('../models/file');

module.exports = {
	read: {
		file: {
			byIdFile(req, res) {

				file_model.getFileById(req.params.id)
					.then(data => {

						const json = {
							file: data
						}

						if (data) res.status(200);
 						else res.send(404);

						res.send(json);
					})
					.catch(err => {
						if (err) res.status(500);
						res.end();
					});

			}
		}
	},
	upload: {
		singleFile: {
			byReference(req, res) {
				// TODO: no upload
			},
			byCopy(req, res) {
				const file_uuid = uuid.v4();
				const file = req.files.file.name.match(/(?<name>[^\.]+)\.(?<ext>.+)/).groups;
				const newPathToFile = path.join(__dirname, '../database/files', file_uuid + '.' + file.ext);

				req.files.file.mv(newPathToFile, err => {
    			if(err) {
						res.status(500).end();
					}
					else {
						console.log('File uploaded:', req.files.file.name, 'as: ', newPathToFile);
						file_model.addNewFile(newPathToFile, file_uuid, file.name)
							.then(json => {
								console.log(json);
								res.status(200).send({file_uuid});
							})
							.catch(err => {
							console.log(err);
						});
					}
				});
			}
		}
	},
	delete: {
		file: {
			byIdFile(req, res) {
				file_model.deleteFileById(req.params.id)
					.then(path => {
						if (path) fs.unlink(path, err => {
							if (err) {
								console.log(err);
								res.status(500).end();
							}
							else {
								console.log('File', path, 'deleted successfully!');
								res.status(200).end();
							}
						})
					})
					.catch(err => {
						console.log(err);
					})
			}
		}
	},
	edit: {

		file: {

			name(req, res) {
				file_model.renameFileById(req.params.id, req.body.name)
					.then(json => {
						res.status(200).end();
					})
					.catch(err => {
						console.log(err);
						res.status(500).end()
					})
			}
		}
	}
};
