var Animate;
(function(){

	var EFFECT = {
		empty:function(dom){
			$(dom).show();
		},
		fadeOut:function(dom){
			$(dom).show().css({"opacity":"0"}).animate({"opacity":"1"});
		},
		boost:function(dom){
	//		$(dom).show().css({"opacity":"0"}).animate({"opacity":"1"});
			var t = parseInt($(dom).css("top")=="auto"?0:$(dom).css("top").replace("px","")),h = parseInt($(document).height());
			$(dom).show().css({"top":t+h}).animate({"top":t});
		},
		erasure:function(dom){
			var t = parseInt($(dom).css("top")=="auto"?0:$(dom).css("top").replace("px","")),h = parseInt($(document).height());
			var l = parseInt($(dom).css("left")=="auto"?0:$(dom).css("left").replace("px","")),w = parseInt($(document).width());
			$(dom).show().css({"top":t+h,"left":l+w}).animate({"top":t,"left":l});
		}
	}
	
	function effect(){

	}

	effect.prototype.setEffect = function(dom,effect){
		$(dom).data('effect',effect);
		this.show(dom);
	}

	effect.prototype.show = function(dom){
		if($(dom).data('effect'))
			EFFECT[$(dom).data('effect')].call(null,dom);
		else{
			EFFECT['empty'].call(null,dom);
		}
		
	}

	Animate = new effect();

})()

