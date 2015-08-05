var path = require('path');
var fs = require('fs');
var superagent = require("superagent");
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

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
	//item.url = 'https://cnodejs.org/';
	superagent.get(item.url)
		.end(function(err, res){
			if(err){
				return console.error(err);
			}
			var listUrls = [];
			var $ = cheerio.load(res.text);
			// 获取首页所有的链接
			if(!item.selector) return;
			eval(item.selector).each(function(idx, element){
				var $element = $(element);
				// 用 url.resolve 来自动推断出完整 url，变成
				var spiderUrl = $element.attr(item.selectorAttr);
				if(!/http:/.test(spiderUrl)) spiderUrl = url.resolve(item.url, spiderUrl);
				listUrls.push(spiderUrl);
			});
			
			//that.log(listUrls);
			
			var concurrencyCount = 0;
			var fetchUrl = function(spiderUrl, callback){
				var startTime = new Date().getTime();
				concurrencyCount++;
				superagent.get(spiderUrl)
					.end(function(err, res){
						if(err){
							return console.error(err);
						}
						var delay = new Date().getTime() - startTime;
						that.log('现在的并发数是' + concurrencyCount + '，正在抓取的是' + spiderUrl + '，耗时' + delay + '毫秒');
						concurrencyCount--;
						var $ = cheerio.load(res.text);
						
						var elements = item.element ? JSON.parse(item.element) : {};
						var data = {};
						for(key in elements){
							data[elements[key].name] = eval(elements[key].selector);
						}
						data.spiderUrl = spiderUrl;
						callback(null, data);
					})
			}
			
			async.mapLimit(listUrls, 3, function(spiderUrl, callback){
				fetchUrl(spiderUrl, callback);
			}, function(err, result){
				console.log('final:');
				console.log(result);
			});
			
		});
}

//日志
Spider.prototype.log = log = function(info){
	process.send(JSON.stringify({ info: info }));
}
