(function($) {
  'use strict';

  $(function() {
    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
      $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
      $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
    });
  });
})(jQuery);

$(function(){
		
	$("#spider-list").delegate('li', {
		mouseenter: function () {
			$(this).children('div').show();
		},
		mouseleave: function () {
			$(this).children('div').hide();
		}
	});
	
	
	$('#AddBtn').on('click', function() {
		$('#AddTpl').modal({
			relatedTarget: this,
			onConfirm: function(options) {
				var AddForm = $('#AddForm');
				var form = {};
				form.name = AddForm.find('.name').val();
				form.url = AddForm.find('.url').val();
				
				$.post('/project/add', form, function(data){
					addItem(data.item);					
				})
				
			},
			//closeOnConfirm: false,
			onCancel: function() {
				//console.log(this.relatedTarget);
			}
		});
	});	
	
	
	function addItem(item){
		var spiderList = $('#spider-list');
		var dom = spiderList.find('li').last().clone();
		dom.find('span').html(item.name);
		spiderList.append(dom);
	}
	
})