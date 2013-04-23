/// 幻灯片相关
var Slide;
(function (exports) {
	function TextRect(rect,doc) {
        this.doc = doc || document;
        this.textState = "non-empty";
        this.textRect_ = rect;
        // 可编辑
        this.textRect_.setAttribute('contenteditable', true);
        $(this.textRect_).addClass('text-rect');
        $(this.textRect_).css({"border":"1px solid transparent"});
        // 快捷键
        this.shortcuts_ = {};
        $(this.textRect_).on('focus',this.onFocus_.bind(this))
            .on('keydown',this.onKeyDown_.bind(this))
            .on('keyup',this.onKeyUp_.bind(this))
            .on('blur',this.onBlur_.bind(this))
            .on('selectionchange',this.onSelectionChange_.bind(this))
            .on('mouseover',this.onMouseover_.bind(this))
            .on('mouseout',this.onMouseout_.bind(this))
        this.wrapInSpan_(this.textRect_, true);
        $(this.textRect_).data('rect', 'text-rect');
    };
    /**
     * 获取编辑区域的HTML内容
     * @returns string
     */
    TextRect.prototype.getContent = function() {
        return this.textRect_.innerHTML; 
    };

    TextRect.prototype.onMouseover_ = function(e) {
        $(this.textRect_).css({"border":"1px dashed rgb(144,176,224)"});
        var self = this;
        this.flag = false;
        if( $(this.textRect_).find('.trash').length==0){
            var d = $('<a class="trash" style="top:0px;cursor:pointer;position:absolute;top:-8px;right:-8px;color:#f00"><i class="icon-remove"></i></a>');
         //   d.css({"",""});
            $(this.textRect_).append(d);
            $(this.textRect_).find('.trash').click(function(){
                $(self.textRect_).remove();
            }).mouseover(function(){
                this.flag = true;
            }).mouseout(function(){
                this.flag = false;
            })
        }
        else{
            $(this.textRect_).find('.trash').show();
        }
    }

    TextRect.prototype.onMouseout_ = function(e) {
        $(this.textRect_).css({"border":"1px solid transparent"});
        var self = this;
        if(!self.flag)
            $(this.textRect_).find('.trash').hide();
        
    }
    /**
     * 获取编辑区域的HTML元素
     * @returns {HTMLDivElement}
     */
    TextRect.prototype.getElement = function() {
        return this.textRect_;
    };
    /**
     * 设置选区或当前行的样式
     */
    TextRect.prototype.setStyle = function() {
        this.applyStyle_.apply(this,arguments);
    };

    TextRect.prototype.addContent = function(c){
        sel = this.doc.getSelection();  
        if (sel.getRangeAt && sel.rangeCount) {  
        range = sel.getRangeAt(0);  
        range.deleteContents();  
        var el = this.doc.createElement('span');  
        el.innerHTML = c;  
        var frag = this.doc.createDocumentFragment(), node, lastNode;  
        while ( (node = el.firstChild) )  
         {  
            lastNode = frag.appendChild(node);  
         }  
                     
        range.insertNode(frag);  
            if (lastNode) {  
                range = range.cloneRange();  
                range.setStartAfter(lastNode);  
                range.collapse(true);  
                sel.removeAllRanges();  
                sel.addRange(range);  
            }  
        }  
    //    selection.addRange(c);
      //  console.log("2");
    }
	/// 恢复选区
    TextRect.prototype.restoreRange = function() {
		var selection = this.doc.getSelection();
        selection.removeAllRanges();
		selection.addRange(this.range_);
    };

    /**
     * 清理HTML，合并属性相同的同行相邻元素
     */
    TextRect.prototype.tidyStyle_ = function() {
        var el = this.textRect_.firstChild.firstChild,last_el = {style:{}};
        while(el) {
            // 合并样式相同的行内元素
            if(
                el.style &&
                el.style.fontSize === last_el.style.fontSize
                && el.style.fontFamily === last_el.style.fontFamily
                && el.style.color === last_el.style.color
                && el.style.fontWeight === last_el.style.fontWeight
                && el.style.fontStyle === last_el.style.fontStyle
                && el.className === last_el.className
            ){
                el.textContent = last_el.textContent + el.textContent;
                $(last_el).remove();
            }
            last_el = el;
            if(el.nextSibling === null) { // 换行了
                last_el = {style:{}};
                if(el.parentNode.nextSibling) {
                    el = el.parentNode.nextSibling.firstChild;
                }else{
                    el = null;
                }
            }else{
                el = el.nextSibling;
            }
        }
    };
    /**
     * 应用样式时遍历所有元素
     */
    TextRect.prototype.nextEl_ = function(el) {
        if(el.nextSibling === null && el.parentNode.nextSibling) {
            return el.parentNode.nextSibling.firstChild;
        }else{
            return el.nextSibling;
        }
    };
    TextRect.prototype.getRange_ = function() {
        return this.range_;
    };
    /**
     * 为选区应用样式
     */
    TextRect.prototype.applyStyle_ = function(elCallBack,force) {
    	var selection = this.doc.getSelection();
        var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null ;
        if(range === null) return;
        var sn = range.startContainer.parentNode,so = range.startOffset,
            en = range.endContainer.parentNode, eo = range.endOffset,
            el = sn,finish = false;
        if(typeof(force)==='undefined') {
            force = false;
        }
        if(force===true){
            elCallBack(sn.parentNode,true);
            return;
        } else if (force === false && range.collapsed) {
            return;
        }

        // 遍历选取中的所有元素
        while(el){
            if(sn === en){ // 仅选中一个元素的情况
                if(so===0 && eo===el.textContent.length) { // 整个选中
                    elCallBack(el);
                }else if(so === 0) {
                    var span = el.cloneNode();
                    span.textContent = el.textContent.substr(0, eo);
                    $(el).before(span);
                    elCallBack(span);
                    el.textContent = el.textContent.substr(eo);
                    sn = en = span;
                    so = 0;
                    eo = span.textContent.length;
                }else if(eo === el.textContent.length){
                    var span = el.cloneNode();
                    span.textContent = el.textContent.substr(so);
                    $(el).after(span);
                    elCallBack(span);
                    el.textContent = el.textContent.substr(0,so);
                    sn = en = span;
                    so = 0;
                    eo = span.textContent.length;
                }else{
                    var spanMid = el.cloneNode();
                    spanMid.textContent = el.textContent.substr(so, eo - so);
                    $(el).after(spanMid);
                    var spanEnd = el.cloneNode();
                    spanEnd.textContent = el.textContent.substr(eo);
                    $(spanMid).after(spanEnd);
                    elCallBack(spanMid);
                    el.textContent = el.textContent.substr(0,so);
                    sn = en = spanMid;
                    so = 0;
                    eo = spanMid.textContent.length;
                }
                finish = true;
            }else if(el === sn) { // 第一个节点
                if(so === 0) { // 第一个节点被整个选中
                    elCallBack(el);
                    so = 0;
                    // 处理仅选中一个节点的特殊情况
                    if(sn === en) {
                        eo = el.textContent.length;
                        finish = true; // 结束标志
                    }else{
                        so = 0;
                    }
                }else{ // 从中间部分选中第一个节点
                    var span = el.cloneNode();
                    span.textContent = el.textContent.substr(so);
                    $(el).after(span);
                    elCallBack(span);
                    el.textContent = el.textContent.substr(0,so);
                    el = span;
                    // 起点元素变更
                    sn = span;
                    so = 0;
                }
                el = this.nextEl_(el);
            }else if(el === en) { // 末尾的节点
                if(eo === el.textContent.length) { // 整个选中末尾节点
                    elCallBack(el);
                    eo = el.textContent.length;
                }else{ // 部分选中末尾节点
                    var span = el.cloneNode();
                    span.textContent = el.textContent.substr(0, eo);
                    $(el).before(span);
                    elCallBack(span);
                    el.textContent = el.textContent.substr(eo);
                    // 终点变更
                    en = span;
                    eo = span.textContent.length;
                }
                finish = true; // 结束标志
            }else{
                elCallBack(el);
                el = this.nextEl_(el);
            }
            // 结束选区操作
            if(finish) { break; }
        }
        // DOM操作会让选区重置，需要重新选择
        // this.focus = true;
        this.range_ = this.doc.createRange();
        this.range_.setStart(sn.firstChild, 0);
        this.range_.setEnd(en.firstChild, eo);

        var selection = this.doc.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.range_);
    };

    /**
     * 处理键盘快捷键
     */
    TextRect.prototype.onKeyDown_ = function(e) {
        // 仅处理快捷键操作
        if(e.ctrlKey) {
            e.preventDefault();
            var key;
            switch(e.keyCode){
                case 189:
                    key = '-';
                    break;
                case 187:
                    key = '+';
                    break;
                default:
                    key = String.fromCharCode(e.keyCode);
            }
            $(this).trigger('CTRL+'+key);
        }
    };

    /**
     * 用于修正输入时的结构问题：
     * <div contenteditable="true">
     *     XXXX      // -- 问题1 -> <div><span>XXXX</span></div>
     *     <div>
     *         YYYY   // -- 问题2 -> <span>YYYY</span>
     *     </div>
     * </div>
     */
    TextRect.prototype.wrapInSpan_ = function(ctr,inner) {
        for(var i=0;i<ctr.childNodes.length;++i) {
            if(ctr.childNodes[i] instanceof Text) {
                if( ctr.childNodes[i].length>0 && !ctr.childNodes[i].nodeValue.match(/^\s*$/) ) {
                    var range = this.doc.createRange();
                    range.setStart(ctr.childNodes[i], 0);
                    range.setEnd(ctr.childNodes[i], ctr.childNodes[i].length);

                    var span = this.doc.createElement('span');
                    range.surroundContents(span);
                    if(inner) {
                        var div = this.doc.createElement('div');
                        range.surroundContents(div);
                    }
					
					delete range;
					++i;
                }else{
					$(ctr.childNodes[i]).remove();
				}
            }else if(inner && ctr.childNodes[i] instanceof HTMLDivElement){
                this.wrapInSpan_(ctr.childNodes[i],false);
            }
        }
    };
    /**
     * 处理键盘输入
     */
    TextRect.prototype.onKeyUp_ = function(e) {
        // 仅处理普通输入
        if(!e.ctrlKey) {
            this.wrapInSpan_(this.textRect_,true);
        }
    };

	TextRect.prototype.onBlur_ = function(e) {
        var self = this;
        $(this.textRect_).mouseout(function(){
            self.onMouseout_();
        }).mouseout();
        this.textState = "non-empty";
        $(this).trigger('blur');
        this.focus_ = false;
		this.tidyStyle_();
        clearInterval(this.timer);
    };

    TextRect.prototype.onFocus_ = function(e) {
        $(this.textRect_).unbind('mouseout');
        $(this.textRect_).css({'border':'1px dashed rgb(144,176,224)'});
        var text = this.doc.getSelection().toString();
        this.focus_ = true;
        //var self = this;
        this.getElement().scrollTop = 0;
        this.getElement().scrollLeft = 0;
        var self = this;
        this.timer = setInterval(function () {
            var selection = self.doc.getSelection();
            if(selection.toString() != "" && self.textState == "empty"){
                $(self).trigger('focus',true);
                self.textState = "non-empty";
            }
            else if(selection.toString() == "" && self.textState == "non-empty"){
                $(self).trigger('focus',false);
                self.textState = "empty";
            }
         //   self.range_ = selection.rangeCount>0 ? selection.getRangeAt(0) : null;
         //   if (self.range_ === null) return;
         //   selection.removeAllRanges();
         //   selection.addRange(self.range_);
        },100);
    };

    TextRect.prototype.onSelectionChange_ = function(e) {
        if(this.focus_) {
            delete this.range_;
            this.range_ = this.doc.getSelection().getRangeAt(0);
			/// TODO 提取样式
        }
    };


    var daddy = null;
    var startx = null;
    var starty = null;
    var starth = null;
    var startw = null;
    var rDrag = { 
        o:null,
        init:function(o){
            daddy = $(o).parent().get(0);
            o.onmousedown = this.start;
            o.onmouseover = rDrag.over;
        },
        start:function(e){
            var o;
            e = rDrag.fixEvent(e);
            e.preventDefault && e.preventDefault();
            rDrag.o = o = this;
            startx = o.x = e.clientX - rDrag.o.offsetLeft;
            starty = o.y = e.clientY - rDrag.o.offsetTop;
            startw = o.h = e.clientX - rDrag.o.offsetWidth;
            starth = o.w = e.clientY - rDrag.o.offsetHeight;
      //      daddy.style.zIndex = "999999";
            if(e.target.style.cursor.indexOf('se')>-1){
                o.onmousemove = rDrag.resizeble;
            }
            else if(e.target.style.cursor.indexOf('move')>-1){
                daddy.onmousemove = rDrag.move;
            }
            daddy.onmouseup = rDrag.end;
        },
        over:function(e){
            if(e.offsetX>e.target.offsetWidth-5 && e.offsetY>e.target.offsetHeight-5){
                e.target.style.cursor = 'se-resize';
            }
            else{
                e.target.style.cursor = 'move';
            }
        },
        resizeble:function(e){
            e = rDrag.fixEvent(e);
            e.preventDefault && e.preventDefault();
            oWidth = e.clientX - startw;
            oHeight = e.clientY - starth;
            rDrag.o.style.width = oWidth+10 + 'px';
            rDrag.o.style.height = oHeight+10 + 'px';
        },
        move:function(e){
            e = rDrag.fixEvent(e);   
            var oLeft,oTop;
            rDrag.o.mousedown = null;
            oLeft = e.clientX - startx;
            oTop = e.clientY - starty;
            rDrag.o.style.left = oLeft + 'px';
            rDrag.o.style.top = oTop + 'px';
            
        },
        end:function(e){
            e = rDrag.fixEvent(e);
      //      daddy.style.zIndex = "-1";
            rDrag.o = daddy.onmousemove = daddy.onmouseup = rDrag.o.onmousemove = null;
        },
        fixEvent: function(e){
            if (!e) {
                e = window.event;
                e.target = e.srcElement;
                e.layerX = e.offsetX;
                e.layerY = e.offsetY;
            }
            return e;
        }
    }

    function ImageRect(rect,doc) {
        this.rect_ = rect;
        $(this.rect_).addClass("img-rect");
        this.doc = doc || document;
        moveDoc = this.doc;
    //    $(this.rect_).draggable();
        
    //    this.draggable();
        var self = this;
    //    bindResize(this.rect_);
        rDrag.init(this.rect_);
    //    $(this.rect_).resizable();
        $(this.rect_).dblclick(function(){self.onClick_()});
        $(this.rect_).blur(function(){self.onBlur_()});
        $(this.rect_).focus(function(){self.onFocus_()});
    };

    ImageRect.prototype.onClick_ = function() {
        $(this.rect_).remove();
    }

    ImageRect.prototype.resizeble = function(){
  //      $(this.rect_).mouseover(function(e){
    //        var $this = $(this);
    //        if(e.offsetX<$this.width()+3 && e.offsetY<$this.height()+3){
    //            $this.css({"cursor":"se-resize"});
    //        }
    //        else{
      //          $this.css({"cursor":"auto"});
                
    //        }
 //       })
    }


    ImageRect.prototype.getElement = function() {
        return this.rect_;
    };

    ImageRect.prototype.onBlur_ = function() {
  //      $(this.rect_).css({"border":"0px solid blue"});
    }

    ImageRect.prototype.onFocus_ = function(){
  //      $(this.rect_).css({"border":"1px solid red"});
    }

    var DRAW = {
        line:function(slide,svg,stroke){
            $(slide).css("cursor","crosshair");
            $(slide).mousedown(function(ev){
                var line = null;
                $(slide).mousemove(function(e){
                    if(line){
                    }
                    else{
                        line = svg.line(0,100,100,0).draggable().attr({ fill: 'none', stroke: '#000', 'stroke-width': stroke });
                    }
                })

                $(slide).mouseup(function(evu){
                    $(slide).css("cursor","auto");
                  //  svg.size(Math.abs(evu.offsetX-ev.offsetX),Math.abs(evu.offsetY-ev.offsetY));
                    $(slide).unbind('mousedown');
                    $(slide).unbind('mouseup');
                    $(slide).unbind('mousemove');
                })
            })
           // svg.rect(100,100);
        },
        rect:function(slide){

        },
        circle:function(slide){

        },
        ellipse:function(slide){

        }
    }

    function Slide(slide) {
        var self = this;
        this._slide = slide;
        $(this._slide).attr('tabindex',"-1");
      //  $(this.rect_).click(function(){self.onClick_()});
        $(this._slide).blur(function(){self.onBlur_()});
        $(this._slide).focus(function(){self.onFocus_()});
        $(this._slide).data('slide','slide_');
        this.drag_();

        this._svg = [];
        if($(slide).find('svg').length>0){
            for(var i=0;i<$(slide).find('svg').length;i++){
                this._svg.push(SVG($(slide).find('svg')[i])); 
            }
        }
    };



    Slide.prototype.draw =function(graph,param){
        this._svg.push(SVG(this._slide));
        DRAW[graph].call(null,this._slide,this._svg[this._svg.length-1],param);
    }

    Slide.prototype.setStyle = function(func){
        func(this._slide);
    }

    Slide.prototype.onBlur_ = function(){
        var self = this;
        var id = $(this._slide).attr('id');
        $(self).trigger('blur',[self,id]);
    }

    Slide.prototype.onFocus_ = function(){
        var self = this;
        var id = $(this._slide).attr('id');
        $(self).trigger('focus',[self,id]);
    }

    Slide.prototype.drag_ = function(){
        var self = this;
        
    }
	// TODO 补充相关方法函数
	// exports

   


    exports.TextRect = TextRect;
    exports.ImageRect = ImageRect;
    exports.Slide = Slide;
}(Slide || (Slide = {}))); // Slide module
