const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const file_model = require('../models/file');

module.exports = {
	read: {
		file: {
			byIdFile(req, res) {

				file_model.getFileById(req.params.uuid)
					.then(file => {

						if (file) res.status(200);
 						else res.status(404);

						res.send(file);
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
				// TODO: no upload but reference to local file
			},
			byCopy(req, res) {
				const file_uuid = uuid.v4();
				const file = req.files.file.name.match(/(?<name>[^\.]+)\.(?<ext>.+)/).groups;
				const newFileName = file_uuid + '.' + file.ext;
				const newPathToFile = path.join(__dirname, '../public/files', newFileName);
				
				if (req.body.name) file.name = req.body.name;

				req.files.file.mv(newPathToFile, err => {
    			if(err) {
						res.status(500).end();
					}
					else {
						console.log('File uploaded:', req.files.file.name, 'as: ', newPathToFile);
						file_model.addNewFile(file_uuid, file.name, file.ext)
							.then(file => {
								console.log(file);
								res.status(200).send(file);
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
				file_model.deleteFileById(req.params.uuid)
					.then(filepath => {
						filepath = path.join(__dirname, '../public/files', filepath);
						if (filepath) fs.unlink(filepath, err => {
							if (err) {
								console.log(err);
								res.status(500).end();
							}
							else {
								console.log('File', filepath, 'deleted successfully!');
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
				file_model.renameFileById(req.params.uuid, req.body.name)
					.then(file => {
						res.status(200).send(file);
					})
					.catch(err => {
						console.log(err);
						res.status(500).end()
					})
			}
		}
	}
};
