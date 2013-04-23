(function () {
	/// 演示 Slide 列表
	$.widget("edit.slideUI", $.ui.sortable, {
		options: {
			frame: null,
		},
		_create: function () {
			this._super();
			this._index = 0;
			if (this.options.frame instanceof HTMLIFrameElement) {
				this._slides = [];
				this._window = this.options.frame.contentWindow;
			} else {
				throw "option frame must be specified.";
			}
		},
		_onStart: function (e, ui) {
			ui.item.data('start-index',ui.item.index());
		},
		_onUpdate: function (e, ui) {
			var sIndex = ui.item.data('start-index'),
				eIndex = ui.item.index();
			var slide = this._slides[sIndex];
			this._slides.splice(sIndex, 1);
			this._slides.splice(eIndex, 0, slide);
		},
		_init: function () {
			this._super();
			this._setOption('update', this._onUpdate.bind(this));
			this._setOption('start', this._onStart.bind(this));
			this._setOption('distance', 15);
			$(this.element).delegate('div', 'click', this._onSlideClick.bind(this));
		},
		_takeSnapshot: function (el, target,hide) {
			var self = this;
			this._window.html2canvas(el, {
				"onrendered": function (canvas) {
					target.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, target.width, target.height);
					if(hide)$(el).hide();
				}
			});
		},
		push: function (html,hide) {
			var self = this;
			var slide = $(html).attr('id',this._slides.length).get(0);
			this._window.document.body.appendChild(slide);
			this._slides.push(slide);
			var div = $('<div style="margin-top:10px"></div>');
			var canvas = $('<canvas width="200" height="150" ></canvas>').disableSelection()[0];
			var del = $('<a style="display:inline-block;float:right;cursor:pointer;position:relative;right:24px;top:-2px;font-size:18px;color:red"><i class="icon-remove"></i></a>');
			this.element.append(div);
			div.append(del);
			div.append(canvas);
			del.click(function(){
				self.setActive(self._slides.length - 1);
				self.remove();
			})
			this.setActive(this._slides.length - 1);
			this._takeSnapshot(slide, canvas,hide);
		},

		redraw: function(index,html,build){
			var self = this;
			if(index != null)	
				this._takeSnapshot(this._slides[index], $(this.element).children('div').children('canvas:eq(' + index + ')')[0]);
			else{
				for(var i=0;i<this._slides.length;i++){
					this._slides[i].remove();
				}
				this._slides = [];
				this._window.document.body.innerHTML = "";
				this.element.empty();
				$(html).each(function(i){
					var flag = false;
					if(this.style.display=='none'){
						$(this).show();
						flag = true;
					}
					if(build && i!=0)
						flag = true;
					self.push(this,flag);
				})
			}
		},
		setActive: function (index) {
			this._index = index;
			$(this.element).children().removeClass('active');
			$(this.element).children(':eq(' + index + ')').addClass("active");
			//// TODO 编辑		
		},
		remove: function () {
			var $current = this.element.children(':eq(' + this._index + ')');
			if ($current.length > 0) {
				$current.slideUp().remove();
			}
			$(this._slides[this._index]).remove();
			this._slides.splice(this._index, 1);
		},
		_onSlideClick: function (e) {
			this.setActive($(e.currentTarget).index());
			$(editor).trigger('moveSlide',$(e.currentTarget).index());
		}
	});
}());
