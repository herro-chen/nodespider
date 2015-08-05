var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var rootPath = path.join(__dirname, '../');

/* GET home page. */
router.get('/', function(req, res, next){
	var filesinfo = [];
	fs.readdirSync(rootPath + 'db/').forEach(function(file){
		var info = { filename: file };
		filesinfo.push(info);
	})
	//console.log(filesinfo);
	res.render('index', { lists: filesinfo });
});

module.exports = router;
