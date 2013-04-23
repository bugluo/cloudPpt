var Editor;
(function (exports) {
    var STATUS = ['textNormal','imgNormal','textDisable','imgDisable'];
    function editor(toolbar){
        this.toolbar = toolbar;
    }

    editor.prototype.setToolBar = function(toolbar){
        this.toolbar = toolbar;
    }

    editor.prototype.play = function(id){
        var self_ = this;
        this.n = 0;
        $(self_.doc.querySelectorAll('.slide')).hide();
        self_.doc.oncontextmenu = function(){
            $(self_.doc).trigger('click',1);
            return false;
        }
        $(this.doc).click(function(ev,bu){
            if(ev.button==0){
                self_.next();
            }
            else if(bu ||ev.button){
                self_.last();
            }
        })
        

   //     $(this.doc.querySelector('.slide')).show();
        
        document.querySelector('body').webkitRequestFullScreen();
    }

    editor.prototype.next = function(){
        var s = $(this.doc.querySelectorAll('.slide')).hide();

        var l = s.length;
        if(parseInt(this.n+1)<l){
            this.n++;
            Animate.show(s.eq(this.n));
        }
        else if(parseInt(this.n+1)==l){
            this.n++;
        }
        else{
            this.stop();
        }
    }

    editor.prototype.last = function(){
        var s = $(this.doc.querySelectorAll('.slide'));
        var l = s.length;
        if(this.n!=0){
            s.hide();
            this.n--;
            s.eq(this.n).show();
        }
    }

    editor.prototype.stop = function(){
        this.doc.oncontextmenu = null;
        $(this.doc).unbind('click');
        document.webkitCancelFullScreen();
        $(this.doc.querySelectorAll('.slide')[0]).show();
    }

    editor.prototype.setSlide = function (doc) {
    	var self = this;
        doc = doc || document;
        this.doc = doc;
        $(self).unbind('moveSlide');
        $(self).on('moveSlide',function(e,index){
            if(index != undefined && doc.querySelectorAll('.slide').length>0){
                $(doc.querySelectorAll('.slide')).hide().eq(index).show().focus();
            }
        })

        $(doc.querySelectorAll('.slide')).each(function(){
            if($(this).data('slide')){
                return;
            }
            var slidess = doc.querySelectorAll(".slide");
            var top = $(doc).height()-$(doc.querySelector(".slide")).height();
            $(slidess).css({"top":top/2,"position":"reletive"});

            var slide = new Slide.Slide(this);
            $(slide).on('blur',function(e,v,i){
                $listUI.slideUI("redraw",i);
            })
            $(slide).on('focus',function(e,v,i){
                self.toolbar.setSlide(slide,v);
            })
        })
            

    	$(doc.querySelectorAll('.rect')).each(function () {
    		if ($(this).data('rect')) {
    			return;
    		}
    		var rect;
    		if (this.nodeName.toLowerCase() == "div") {
    			rect = new Slide.TextRect(this,doc);
    		} else if (this.nodeName.toLowerCase() == "img") {
    			rect = new Slide.ImageRect(this);
    		} else {
    	//		throw "unsupported rect";
    		}
    		$(rect).on('blur', function (e) {
    			self.toolbar.setRect(null);
    		}).on('focus', function (e,v) {
    			self.toolbar.setRect(this,v);
    		});
    	});

    };
    editor.prototype.setRect = function(rect){
        var self = this;
        var r = rect || $(self.doc.querySelectorAll('.rect'));
        r.each(function () {
            if ($(this).data('rect')) {
                return;
            }
            var rect;
            if (this.nodeName.toLowerCase() == "div") {
                rect = new Slide.TextRect(this,self.doc);
            } else if (this.nodeName.toLowerCase() == "img") {
                rect = new Slide.ImageRect(this,self.doc);
            } else {
        //      throw "unsupported rect";
            }
            $(rect).on('blur', function (e) {
                self.toolbar.setRect(null);
            }).on('focus', function (e,v) {
                self.toolbar.setRect(this,v);
            });
        });
    }
    Editor = editor;
})()