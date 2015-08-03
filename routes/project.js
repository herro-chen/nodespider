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
	
	var ret = {};
	var filename = rootPath + 'db/' + req.body.name;
	var _json = JSON.stringify(req.body);
	fs.writeFile(filename, _json, function(err){
		if(err){
			
		}
		console.log(_json);
	});
	
	ret.status = true;
	ret.item = req.body;
	res.send(ret);
});

router.get('/edit', function(req, res, next){
	
	var ret = {};
	if(req.query.name){
		var filename = rootPath + 'db/' + req.query.name;
		console.log(filename);
		fs.readFile(filename, {encoding: 'utf8'}, function(err, data){
			if(err){
				
			}
			ret.status = true;
			ret.item = JSON.parse(data);
			res.send(ret);
		});
	}else{
		ret.status = false;
		res.send(ret);
	}
});

router.post('/edit', function(req, res, next){
	
	var ret = {};
	var filename = rootPath + 'db/' + req.body.oldName;
	fs.unlink(filename, function(err){
		if(err){
			
		}
		filename = rootPath + 'db/' + req.body.name;
		var _json = JSON.stringify(req.body);
		fs.writeFile(filename, _json, function(err){
			if(err){
				
			}
			console.log(_json);
		});
		
		ret.status = true;
		ret.item = req.body;
		res.send(ret);
	})
})

router.get('/delete', function(req, res, next){
	
	var ret = {};
	var filename = rootPath + 'db/' + req.query.name;
	fs.unlink(filename, function(err){
		if(err){
			
		}
		ret.status = true;
		res.send(ret);
	})
})



module.exports = router;
