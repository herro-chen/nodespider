var exec = {};

exec.modal = function(_data){
	
	var AddForm = $('#AddForm');
	var AddTplTitle = $('#AddTplTitle');
	var actionUrl = '/project/edit';
	if(_data){
		AddTplTitle.html('修改任务');
		AddForm.find('.name').val(_data.name);
		AddForm.find('.url').val(_data.url);
	}else{
		AddTplTitle.html('添加任务');
		AddForm.find('.name').val('');
		AddForm.find('.url').val('');
		actionUrl = '/project/add';
	}
	
	$('#AddTpl').modal({
		onConfirm: function(){
			var form = {};
			form.name = AddForm.find('.name').val();
			form.url = AddForm.find('.url').val();
			form.oldName = _data ? _data.name : '';
			$.post(actionUrl, form, function(data){
				if(json.status){
					addItem(data.item);
				}else{
					tip('添加任务失败');
				}
			})
		},
		//closeOnConfirm: false,
		onCancel: function() {
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
        success: function(json){
            if(json.status){
                exec.modal.call(that, json.item);
            }else{
                tip('获取数据失败');
            }
        },
        error: function () {
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
        success: function(json){
            if(json.status){
				self.parents('li').remove();
                tip('删除配置成功');
            }else{
                tip('删除配置失败');
            }
        },
        error: function () {
            tip('删除配置失败');
        }
    });	
};


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
	})
	
	$('#AddBtn').on('click', function(){
		exec.modal.apply(this);
	});		
})