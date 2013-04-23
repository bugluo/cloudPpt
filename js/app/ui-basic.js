


(function () {
	/// 顶部UI组件
	$.widget("common.headUI", {
		options: {
			location: [],
		},
		_create: function () {
			$(this.element).empty().addClass("ui-head").css({"height":"40px"});
			$(this.element).append('<div class="navbar navbar-fixed-top">\
	<div class="navbar-inner" style="padding-right:20px;">\
		<a class="brand" href="#" style="margin-left: 0px;">云演示</a>\
		<ul class="breadcrumb pull-left" style="padding: 0; margin:0; line-height: 40px;">\
		</ul>\
		<ul class="nav pull-right">\
			<li><a href="/create.html"><i class="icon-plus-sign"></i> 新建演示</a></li>\
			<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-user"></i> <span>我的ppt</span> <b class="caret"></b></a>\
				<ul class="dropdown-menu" id="pptList">\
                </ul>\
			</li>\
		</ul>\
    </div>\
</div>');
			window.self_ = this;
			$.getScript('http://js.login.360.cn/?o=sso&m=info&func=self_._callback&time=0.17582909134216607');
			
		},
		_callback: function(e){
			var self = this;
			if(e.userName != null && e.userName != ""){
				DataPersistence.list(function(e){
					$('#pptList').empty();
					for(i in e.files){
						if(e.files[i].title){
							self.appendPpt(e.files[i].title,i);
						}
					}
				})
			}
			else{

			}
			delete window.self_;
		},
		_init: function () {
			this.$crumb = $('.breadcrumb', this.element);
			this._locations = [{ "url": "/", "title": "云演示" }]; // TODO options.home
			
			if (Array.isArray(this.options.location)) {
				for (var i = 0; i < this.options.location.length; ++i) {
					this.push(this.options.location[i]);
				}
			}

			DataPersistence.list(function(){
			});

			$(this).on('render', this._onRender.bind(this));
			$(this).trigger('render');
		},
		_destroy: function () {
		},
		push: function (loc) {
			this._locations.push(loc);
			$(this).trigger('render');
		},
		appendPpt:function(cont,href){
			$('#pptList').prepend('<li><a href="edit.html?id='+href+'&title='+cont+'">'+cont+'</a></li>');
		},
		pop: function () {
			this._locations.pop();
			$(this).trigger('render');
		},
		_onRender: function () {
			var self = this;
			clearTimeout(self.__renderTimeout);
			self.__renderTimeout = setTimeout(function () {
				self.render();
			}, 100);
		},
		render: function () {
			this.$crumb.empty();
			for (var i = 0; i < this._locations.length; ++i) {
				var loc = this._locations[i];
				if (i == this._locations.length - 1) {
					$('<li class="active"></li>').text(loc['title']).appendTo(this.$crumb);
				} else {
					var $li = $('<li><a href="#"></a> <span class="divider">&gt;</span></li>');
					$('a',$li).attr('href', loc['url']).text(loc['title']);
					$li.appendTo(this.$crumb);
				}
			}
		}
	});
	/// 登陆UI组件
	$.widget("common.loginUI", {
		options: {
			visible: true,
		},
		_callback:function(e){
			if(e.userName != null && e.userName != ""){
				var pannel = $('<div class="well" style="margin: 25px; text-align: center;"></div>');
				var popup = $('<div class="alert alert-success" style="margin: 15px;"><i class="icon-info-sign"></i> 尊敬的<span style="color:red">'+e.userName+'</span>，您已经成功登陆，<span style="color:red">点击</span>进入你的PPT</div>\
					');
				var logoff = $('<a class="btn btn-large btn-primary"  id="logoff"><i class="icon-user icon-white icon-large" href="#"></i> 注销</a>');
				$(this.element).append(pannel);
				var self = this;
				DataPersistence.list(function(ev){
					var table = '<table class="table table-hover">';
					table += '<thead><tr><th>#</th><th>题目</th><th>日期</th><th>　</th></tr></thead>';
					table += '<tbody>';
					var ii = 0;
					for(i in ev.files){
						ii++;
						if(ev.files[i].title){
							var date = ev.files[i].date?ev.files[i].date:'2013-04-10';
							table += '<tr data-id='+i+'><td>'+ii+'</td><td><a href="edit.html?id='+i+'&title='+ev.files[i].title+'">'+ev.files[i].title+'</a></td><td>'+date+'</td><td  class="del"><a style="cursor:pointer">删除</a></td></tr>';
						}
					}
					table += '</tbody></table>';
					console.log(ii);
					if(ii>1){
						pannel.append(popup);
						pannel.append($(table));
					}
					else{
						pannel.append($('<div class="alert alert-success" style="margin: 15px;"><i class="icon-info-sign"></i> 尊敬的<span style="color:red">'+e.userName+'</span>，您已经成功登陆，您还未创建PPT，点击<span style="color:red">右上角</span>或<a href="/create.html">这里</a>创造你的第一个PPT</div>\
					'));
					}
					pannel.append(logoff);



					$(self.element).parent().find('.change-log').remove();
					$('.table-hover').on('click','.del',function(){
						var self = this;
						DataPersistence.del($(this).parent().data('id'),function(){
							$(self).parent().hide(200);
						})
					})
				});
				//$(this.element).append();
			}
			else{
				$(this.element).append('<div class="well" style="margin: 25px; text-align: center;">\
					<div class="alert alert-success" style="margin: 15px;"><i class="icon-info-sign"></i> 登陆可以拥有更多功能：</div>\
					<a class="btn btn-large btn-primary" id="login"><i class="icon-user icon-white icon-large" href="#login"></i> 登陆</a>\
				</div>');
			}
			delete window.self;
		}
		,
		_create: function () {
			window.self = this;
			$(this.element).empty().addClass("ui-login");
			$(this.element).css('display', 'none');
			$.getScript('http://js.login.360.cn/?o=sso&m=info&func=self._callback&time=0.17582909134216607');

			

			
		},
		_init: function () {

			var cookieControll = {
				setCookie:function(name,value){
				    var Days = 30; //此 cookie 将被保存 30 天
				    var exp = new Date();    //new Date("December 31, 9998");
				    exp.setTime(exp.getTime() + Days*24*60*60*1000);
				    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
				},
				getCookie:function(name){
						var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
			 		if(arr != null) return unescape(arr[2]); return null;
			 	}
			}

			$(this.element).on('click','#logoff',function(e){
				
				e.preventDefault();
				var destUrl = window.location.href;
				window.location = 'http://login.360.cn/?op=logout&destUrl='+encodeURIComponent(destUrl);
			})
			$(this.element).on('click','#login', this._onLoginClick);
			var self = this;
			$.ajax({
				url: '/user/get?_=' + Math.random(),
				dataType: 'json',
				success: function (user) {
					if (user) { // 已经登陆
						$('.dropdown span', self.element).text(user.email);
					}
					self._trigger('status', null, { "user": user });
				},
				error: function (error) {
					self._trigger('status', null, { "user": false });
				}
			});
		},
		_destroy: function () {
			$(this.element).empty();
		},
		_onLoginClick: function (e) {
			e.preventDefault();
			window.location = 'http://i.360.cn/login/?destUrl=' + encodeURIComponent( 'http://'+window.location.host+'/index.html' );
		}
	});
	$.widget("common.tempUI", {
		options: {
			visible: true,
			template: null,
		},
		_create: function () {
			if (!this.options.visible) {
				$(this.element).css('display', 'none');
			}
			this._frames = {};
		},
		_init: function () {
			$(this.element).delegate('canvas', 'dblclick', this._onSlideDblClick.bind(this))
				.delegate('canvas', 'click', this._onSlideClick.bind(this));
		},
		_setOption: function (key, val) {
			this._superApply(arguments);
			switch (key) {
				case 'template':
					this._loadTemplate();
					break;
			}
		},
		_loadTemplate: function () {
			// 清除已经加载的内容
			for (var file in this._frames) {
				$(this._frames[file]).remove();
				delete this._frames[file];
			}
			var self = this;
			function _load(file,templ) {
				var frame = $('<iframe class="uc-tpl-frame" src="' + file + '?_='+Math.random()+'"></iframe>');
				frame.on('load', self._onTemplateLoad.bind(self, frame[0],templ))
						.appendTo('body')[0];
				self._frames[file] = frame;
			}
			if (this.options.template) { // OPTION 选项使用指定模版文件
				_load(this.options.template,true);
			} else {
				$.get('/template/list?_='+Math.random(), function (list) {
					for (var i = 0; i < list.length; ++i) {
						_load(list[i]);
					}
				}, 'json', false);
			}


			
		},
		_onTemplateLoad: function (frame,temp) {
			var self = this;
			/// 建立模版区块
			var $section = $('<div class="uc-tpl-section" data-file="' + frame.contentWindow.location.pathname + '"></div>');
			// 标题
			$section.append(
				$('<h4 class="uc-tpl-title"></h4>')
					.text(frame.contentDocument.title)
					.append($('<span></span>').text('[' + frame.contentWindow.location.pathname + ']'))
					);
			// 绘制每个模版
			var slides = frame.contentDocument.querySelectorAll(".slide");
			
			var l =temp?slides.length:1;
			for (var i = 0; i < slides.length; ++i) {
				var $canvas = $('<canvas width="200" height="150"></canvas>')
					.data('html', slides[i].outerHTML).appendTo($section);
				if(!temp && i!=1){
					$canvas.hide();
				} else{
			//		self.setActive($canvas);
				}
				if(i ==1){
					self.setActive($canvas);
				}


				this._canvasSlide(frame, $canvas[0], slides[i]);
			}
			$section.appendTo(this.element);
		},
		/// 将指定的 Slide 绘制到 canvas 上
		_canvasSlide: function (frame, canvas, slide) {
			frame.contentWindow.html2canvas(slide, {
				onrendered: function (image) {
					canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
				}
			});
		},
		setActive: function ( $el ) {
			$('canvas', this.element).removeClass('active');
			$el.addClass('active');
		},
		_onSlideClick: function (e) {
			var $el = $(e.currentTarget);
			var html1 = "";
			$el.parent().children().each(function(){
				if($(this).data('html')!=null){
					html1 += $(this).data('html');
				}
			})
			this.setActive($el);
			this._trigger('select', e, { html: $el.data('html'), file: $el.parent().data('file'),html1: html1});
		},
		_onSlideDblClick: function (e) {
			var $el = $(e.currentTarget);
			this.setActive($el);
			this._trigger('action', e, { html: $el.data('html'), file: $el.parent().data('file') });
		}
	});
} ());
