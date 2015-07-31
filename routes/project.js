var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var rootPath = path.join(__dirname, '../');

/* GET project listing. */
router.get('/', function(req, res, next) {
	res.send('project');
});

router.post('/add', function(req, res, next){

	var filename = rootPath + 'db/' + req.body.name;
	
	var _json = JSON.stringify(req.body);
	fs.writeFile(filename, _json, function (err) {
		if(err){
			
		}
		console.log(_json);
	});
	
	var ret = {};
	ret.status = 700;
	ret.item = req.body;
	res.send(ret);
});

module.exports = router;
