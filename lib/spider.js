var path = require('path');
var fs = require('fs');
var superagent = require("superagent");
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var Spider = function(item) {
	this.item = item;
}

// 爬虫开始
Spider.prototype.start = function(_obj) {
	var that = this;
  
	var item = that.item;
  //模拟测试
	//item.url = 'https://cnodejs.org/';
	superagent.get(item.url)
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36')
    .set('Referer', item.url)
		.end( function(err, res) {
			if (err) {
				return console.error(err);
			}
      
			var listUrls = [];
			var $ = cheerio.load(res.text);
			
      // 获取首页所有的链接
			if( ! item.selector) return;
      
			eval(item.selector).each( function(idx, element) {
        if(idx < 3){
          var $element = $(element);
          // 用 url.resolve 来自动推断出完整 url
          var spiderUrl = $element.attr(item.selectorAttr);
          if(!/http:/.test(spiderUrl)) spiderUrl = url.resolve(item.url, spiderUrl);
          listUrls.push(spiderUrl);
        }
			});
      
			//that.log(listUrls);

			var concurrencyCount = 0;
			var fetchUrl = function(spiderUrl, callback){
				var startTime = new Date().getTime();
				concurrencyCount++;
				superagent.get(spiderUrl)
          .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36')
          .set('Referer', item.url)
					.end( function(err, res) {
						if( err ) {
							return console.error(err);
						}
						var delay = new Date().getTime() - startTime;
						that.log('现在的并发数是' + concurrencyCount + '，正在抓取的是' + spiderUrl + '，耗时' + delay + '毫秒');
						concurrencyCount--;
						var $ = cheerio.load(res.text, {
                          decodeEntities: false //防止字符 html实体
                        });
						
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
        _obj.send(result);
				return result;
			});
			
		});
}

//日志
Spider.prototype.log = function(info) {
  console.log(info);
}

module.exports = Spider;
