
const Neode = require('neode')
/*
const instance = require('neode').fromEnv().with({
	document: require('../NeodeModels/document'),
});*/
// J'arrive pas avec withDirectory


module.exports = new Neode('bolt://localhost:7687', 'neo4j', 'admin').with({
			Document: require('../NeodeModels/document'),
		})