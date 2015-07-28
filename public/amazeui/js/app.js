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
})