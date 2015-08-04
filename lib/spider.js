var	http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var request = require("request");
var cheerio = require('cheerio');
var async = require('async');

var rootPath = path.join(__dirname, '../');

// 监听主进程发送过来的信息
process.on('message', function(name){
	console.log('......... ' + name);
	var filename = rootPath + 'db/' + name;
	fs.readFile(filename, {encoding: 'utf8'}, function(err, data){
		if(err){
			console.log(err);
			return;
		}
		
		var item = JSON.parse(data);
		if(item){
			new Spider(item).start();
		}else{
			console.log('配置文件有问题');
		}
	});
	
	
});

var Spider = function(item){
	this.item = item;
}

// 爬虫开始
Spider.prototype.start = function(){
	var that = this;
	
	//模拟测试
	var item = that.item;
	item.url = 'http://baike.baidu.com/view/39744.htm';
	request(item.url, function(error, response, data){
		if(!error && response.statusCode == 200){
			var $ = cheerio.load(data);
			var title = $('.title .lemmaTitleH1').first().text();
			console.log(title);
		}
	});	
}


//日志
Spider.prototype.log = log = function(info){
	process.send(JSON.stringify({ info: info }));
}
