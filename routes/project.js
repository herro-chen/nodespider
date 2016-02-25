var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var Spider = require('../lib/spider');

var rootPath = path.join(__dirname, '../');
var dbPath = rootPath + 'db/';

/* GET project listing. */
router.get('/', function(req, res, next) {
	var filesinfo = [];
	fs.readdirSync(dbPath).forEach(function(file){
		var info = { filename: file };
		filesinfo.push(info);
	})
	res.render('index', { lists: filesinfo });
});

router.get('/start', function(req, res, next){
  if(req.query.name){
    var fileName = req.query.name;
    var file = dbPath + fileName;
    fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
      if (err) {
        return res.send(err);
      }
      
      var item = JSON.parse(data);
      if (item) {
        new Spider(item).start(res);
      }
    });    
  }
});


router.post('/add', function(req, res, next){
	
	var ret = {};
	var filename = rootPath + 'db/' + req.body.name;
	var _json = JSON.stringify(req.body);
	fs.writeFile(filename, _json, function(err){
		if(err){
			return console.error(err);
		}
	});
	ret.status = true;
	res.send(ret);
});

router.get('/edit', function(req, res, next){
	
	var ret = {};
	if(req.query.name){
		var fileName = req.query.name;
    var file = dbPath + fileName;
		fs.readFile(file, {encoding: 'utf8'}, function(err, data){
			if(err){
				return console.error(err);
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
			return console.error(err);
		}
		filename = rootPath + 'db/' + req.body.name;
		var _json = JSON.stringify(req.body);
		fs.writeFile(filename, _json, function(err){
			if(err){
				return console.error(err);
			}
		});
		
		ret.status = true;
		res.send(ret);
	})
})

router.get('/delete', function(req, res, next){
	
	var ret = {};
	var filename = rootPath + 'db/' + req.query.name;
	fs.unlink(filename, function(err){
		if(err){
			return console.error(err);
		}
		ret.status = true;
		res.send(ret);
	})
})

module.exports = router;
