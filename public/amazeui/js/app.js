var exec = {};

exec.modal = function(_data){
	
	var AddForm = $('#AddForm');
	var AddTplTitle = $('#AddTplTitle');
	var actionUrl = '/project/edit';
	$('.element-item').remove();
	var e = $('.element-item-default').first();
	if(_data){
		AddTplTitle.html('修改任务');
		AddForm.find('.name').val(_data.name);
		AddForm.find('.url').val(_data.url);
		AddForm.find('.selector').val(_data.selector);
		AddForm.find('.selectorAttr').val(_data.selectorAttr);
		var elements = _data.element ? JSON.parse(_data.element) : {};
		$.each(elements, function(i, element){
			var elementItem = e.clone();
			elementItem.addClass('element-item');
			elementItem.removeClass('am-hide');
			elementItem.find('.elementName').val(element.name);
			elementItem.find('.elementSelector').val(element.selector);
			e.before(elementItem);
		});
		
	}else{
		AddTplTitle.html('添加任务');
		AddForm.find('.name').val('');
		AddForm.find('.url').val('');
		AddForm.find('.selector').val('');
		AddForm.find('.selectorAttr').val('');
		actionUrl = '/project/add';
	}
	
	$('#AddTpl').modal({
		onConfirm: function(){
			var form = {};
			form.name = AddForm.find('.name').val();
			form.url = AddForm.find('.url').val();
			form.selector = AddForm.find('.selector').val();
			form.selectorAttr = AddForm.find('.selectorAttr').val();
			var elementItem = [];
			$('#AddTpl .element-item').each(function(idx, element){
				var item = {};
				var $element = $(element);
				item.name = $element.find('.elementName').val();
				item.selector = $element.find('.elementSelector').val();
				elementItem.push(item);
			})
			elementItem = JSON.stringify(elementItem);
			form.element = elementItem;
			form.oldName = _data ? _data.name : '';
			$.post(actionUrl, form, function(data){
				if(data.status){
          tip('添加任务成功');
          setTimeout(function(){
            window.location.reload();
          }, 1000);
				}else{
					tip('添加任务失败');
				}
			})
		},
		//closeOnConfirm: false,
		onCancel: function(){
			//console.log(this.relatedTarget);
		}
	});
}

// 编辑配置
exec.edit = function(){
    var that = this;
    var self = $(this);
    $.ajax({
        url: '/project/edit',
        data: {name: self.parent('.am-item-btns').prev('span').text()},
        cache: false,
        success: function(data){
            if(data.status){
                exec.modal.call(that, data.item);
            }else{
                tip('获取数据失败');
            }
        },
        error: function(){
            tip('获取数据失败');
        }
    });
}

// 删除配置文件
exec.remove = function(){
    var self = $(this);
    $.ajax({
        url: '/project/delete',
        data: {name: self.parent('.am-item-btns').prev('span').text()},
        cache: false,
        success: function(data){
            if(data.status){
				self.parents('li').remove();
                tip('删除配置成功');
            }else{
                tip('删除配置失败');
            }
        },
        error: function(){
            tip('删除配置失败');
        }
    });	
};

// 执行爬虫
exec.start = function(){	
	var self = $(this);
	var name = self.parent('.am-item-btns').prev('span').text();	
}

//停止爬虫
exec.stop = function(){
	var self = $(this);
  var name = self.parent('.am-item-btns').prev('span').text();
}

function tip(text){
	var TipTpl = $('#TipTpl');
	TipTpl.find('.am-modal-bd').html(text);
	TipTpl.modal();
}

function addItem(item){
	var spiderList = $('#spider-list');
	var dom = spiderList.find('li').last().clone();
	dom.find('span').html(item.name);
	spiderList.append(dom);
}


$(function(){
	$("#spider-list").delegate('li', {
		mouseenter: function(){
			$(this).children('div').show();
		},
		mouseleave: function(){
			$(this).children('div').hide();
		}
	}).delegate("li button[action=edit]", 'click', function(){
		exec.edit.apply(this);
	}).delegate("li button[action=remove]", 'click', function(){
		exec.remove.apply(this);
	}).delegate("li button[action=start]", 'click', function(){
		exec.start.apply(this);
	}).delegate("li button[action=stop]", 'click', function(){
		exec.stop.apply(this);
	})
	
	$('#AddBtn').on('click', function(){
		exec.modal.apply(this);
	});
	
	$('#addElement').on('click', function(){
		var e = $('.element-item-default').first();
		var elementItem = e.clone();
		elementItem.addClass('element-item');
		elementItem.removeClass('am-hide');
		elementItem.find('input').val('');
		e.after(elementItem);
	})
	
	$('#AddTpl').on('click', '.element-remove', function(){
		$(this).parents('.element-item').remove();
	})
	
})