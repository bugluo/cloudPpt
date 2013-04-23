var ToolBar;
(function () {
 
    var LAYOUT ={
        text: [
            [{name:'bold',title:'加粗'},{name:'italic',title:'斜体'},{name:'underline',title:'下划线'},{name:'strikethrough',title:'中划线'}],
            [{name:'chevron-down',title:'字号－'},{name:'font-size',title:"字号",option:["12px","16px","32px","64px"]},{name:'chevron-up',title:'字号＋'}],
            [{name:'font-family',title:"字体",option:["宋体","微软雅黑","楷体"]}],
            [{name:'edit',title:'文本颜色'},{name:'magic',title:'文本背景'}],
            [{name:'calendar',title:'快速日期',special:true},{name:'time',title:'快速时间',special:true}],
            [{name:'list-ol',title:'有序列表',special:true},{name:'list-ul',title:'无序列表',special:true}],
            [{name:'align-left',title:'左对齐',special:true},{name:'align-center',title:'居中',special:true},{name:'align-right',title:'右对齐',special:true}]
        ],
        slide:[
            [{name:'tablet',title:'新增区域',state:'disable'},{name:'picture',title:'新增图片',state:'disable'}],
            [{name:'star-empty',title:'效果无',state:'disable'},{name:'star',title:'出现',state:'disable'},{name:'star-half',title:'淡入',state:'disable'},{name:'plane',title:'飞入',state:'disable'}]
        ]
    };

    var STATECSS = {
    normal:{"color":"#000","opacity":"1"}, select:{"color":"red","opacity":"0.9"},
    disable:{"color":"gray","opacity":"0.5"} };

    function toolBar(el) {
        this.$el = $('#'+el);
        var self = this;
        this.setRect(null);
        this.setEvent();
        $(this).on('mousedown', function(e,name) {
            if(self._rect || self._slide)
                FEATURE[name.replace("-","_")].call(null,self._rect,name,self._slide);
          //  else if(self._slide)
            //    FEATURE[name.replace("-","_")].call(null,self._slide,name);
        })

    }

    toolBar.prototype.setRect = function(rect,text){
        this._rect = rect;
        if(this._rect==null){
            for(var i=0;i<LAYOUT.text.length;i++){
                for(var j=0;j<LAYOUT.text[i].length;j++){
                    LAYOUT.text[i][j].state = 'disable';
                }
            }
        }
        else if(text){
            for(var i=0;i<LAYOUT.text.length;i++){
                for(var j=0;j<LAYOUT.text[i].length;j++){
                    LAYOUT.text[i][j].state = 'normal';
                }
            }
        }
        else if(!text){
            for(var i=0;i<LAYOUT.text.length;i++){
                for(var j=0;j<LAYOUT.text[i].length;j++){
                    LAYOUT.text[i][j].state = 'disable';
                    if(LAYOUT.text[i][j].special)
                        LAYOUT.text[i][j].state = 'normal';
                }
            }
        }
        this.render();
    }

    toolBar.prototype.setSlide = function(slide,text){
        this._slide = slide;
        if(this._slide==null){
            for(var i=0;i<LAYOUT.slide.length;i++){
                for(var j=0;j<LAYOUT.slide[i].length;j++){
                    LAYOUT.slide[i][j].state = 'disable';
                }
            }
        }
        else if(this._slide!=null){
            for(var i=0;i<LAYOUT.slide.length;i++){
                for(var j=0;j<LAYOUT.slide[i].length;j++){
                    LAYOUT.slide[i][j].state = 'normal';
                }
            }
        }
        this.render();

    }

    toolBar.prototype.setEvent = function() {
        var self = this;
        this.$el.delegate('.btn','mousedown',function(e) {
            $(self).trigger('mousedown', $(e.target).data('name')?$(e.target).data('name'):$(e.target).parent().data('name'));
          //  $(self).trigger('mousedown', $(e.target).data('name')?$(e.target).data('name'):$(e.target).parent().data('name'));
            return false;
        })

        this.$el.delegate('.caret','mousedown',function(e){
            return false;
        })

    }

    toolBar.prototype.render = function(layout) {
        this.$el.empty();
        for(var ii in LAYOUT){
            var funcGroup = $('<div class="func-group"></div>');
            this.$el.append(funcGroup);
            for(var i = 0;i<LAYOUT[ii].length;i++){
                if(LAYOUT[ii][i].length>0){
                    var btnGroup = $('<div class="btn-group"></div>');
                    funcGroup.append(btnGroup);
                    for(var j = 0;j<LAYOUT[ii][i].length;j++){
                        
                        if(LAYOUT[ii][i][j].option){
                            var dropdownMenu = '<div class="btn-group" data-name="' + LAYOUT[ii][i][j].name + '"><a title="'+LAYOUT[ii][i][j].title+'" class="btn btn-small dropdown-toggle" data-toggle="dropdown">'+LAYOUT[ii][i][j].title+'<span class="caret"></span></a><ul class="dropdown-menu">';
                            for(var k=0;k<LAYOUT[ii][i][j].option.length;k++){
                                dropdownMenu += '<li><a>'+LAYOUT[ii][i][j].option[k]+'</a></li>';
                            }
                            dropdownMenu += "</ul></div>";

                            btnGroup.append($(dropdownMenu).css(STATECSS[LAYOUT[ii][i][j].state]));
                        }
                        else{
                            if(STATECSS[LAYOUT[ii][i][j].state])
                                var btn = $('<a title="'+LAYOUT[ii][i][j].title+'" class="btn" data-name=' + LAYOUT[ii][i][j].name + '><i  class="icon-'+ LAYOUT[ii][i][j].name +'"></i></a>').css(STATECSS[LAYOUT[ii][i][j].state]);
                            else{
                                var btn = $('<a title="'+LAYOUT[ii][i][j].title+'" class="btn" data-name=' + LAYOUT[ii][i][j].name + '><i  class="icon-'+ LAYOUT[ii][i][j].name +'"></i></a>');
                            }
                            btnGroup.append(btn).find("dropdown-toggle,li").click(function(){return false;});
                        }
                    }
                }
            }
        }
    };

    function CNDateString(date){
        var cn = ["〇","一","二","三","四","五","六","七","八","九"];
        var s = [];
        var YY = date.getFullYear().toString();
        for (var i=0; i<YY.length; i++)
        if (cn[YY.charAt(i)])
          s.push(cn[YY.charAt(i)]);
        else
          s.push(YY.charAt(i));
        s.push("年");
        var MM = date.getMonth()+1;
        if (MM<10)
        s.push(cn[MM]);
        else if (MM<20)
        s.push("十" + cn[MM% 10]);
        s.push("月");
        var DD = date.getDate();
        if (DD<10)
        s.push(cn[DD]);
        else if (DD<20)
        s.push("十" + cn[DD% 10]);
        else
        s.push("二十" + cn[DD% 10]);
        s.push("日");
        return s.join('');
    }


    var canvasDraw = function(el,img){
        var $el = $(el);
        if(img){
            var co = $(img).css({"position":"absolute"});
            $el.append(co);
            return editor.setRect(co);
        }
        //    return content.drawImage(img, 0,0,end.x-start.x,end.y-start.y);
       
        $el.css("cursor","crosshair");
        var c = $("<div><canvas id='canvas' width='"+$el.width()+"' height='"+$el.height()+"'></canvas></div>").css({"position":"absolute","display":"block","z-index":"99999"});
        $el.append(c);
        var start = {};
        var end = {};
        c.find("#canvas").mousedown(function(e){
            start.x = e.offsetX;
            start.y = e.offsetY;
        })

        c.find("#canvas").mousemove(function(e){
            
            if(start.x && start.y){
                end.x = e.offsetX;
                end.y = e.offsetY;
                var content = c.find("#canvas")[0].getContext("2d");
                content.clearRect(0,0,$el.width(),$el.height());
            //    content.fillStyle = "#fff";
            //    content.fillRect(0,0,$el.width(),$el.height());
                content.strokeStyle = "000";
                content.linewidth=10;
            
                content.strokeRect(start.x,start.y,end.x-start.x,end.y-start.y);
               
            }
        })

        c.find("#canvas").mouseup(function(e){
            
            $el.unbind("mousemove");
            $el.unbind("mousedown");
            $el.unbind("mouseup");
            c.remove();
            $(el).css("cursor","auto");
            var top = start.y>end.y?end.y:start.y;
            var left = start.x>end.x?end.x:start.x;
            var width = start.x>end.x?start.x-end.x:end.x-start.x;
            var height = start.y>end.y?start.y-end.y:end.y-start.y;

            if(!img){
                var co = $("<div class='rect' style='position:absolute;top:"
                +top+"px;left:"
                +left+"px;width:"
                +width+"px;height:"
                +height+"px;'><span>此区域输入内容</span></div>");
            }
            else{
                var co = $(img).css({"position":"absolute","top":top,"left":left,"width":width,"height":height}).addClass("rect");
            }

            $el.append(co);
            editor.setRect(co);
            start = {};
        })
    }

    //所有方法与LAYOUT名字对应
    var FEATURE = {
        bold: function(rect) {

            rect.setStyle(function(el){

                if($(el).css("font-weight")=="bold")
                    $(el).css({"font-weight":"normal"});
                else{
                    $(el).css({"font-weight":"bold"});
                }
            });
        },
        italic: function(rect) {
            rect.setStyle(function(el){
                if($(el).css("font-style")=="italic")
                    $(el).css({"font-style":"normal"});
                else{
                    $(el).css({"font-style":"italic"});
                }
            });
        },
        underline: function(rect) {
            rect.setStyle(function(el){
                if($(el).css("text-decoration")=="underline")
                    $(el).css({"text-decoration":"none"});
                else{
                    $(el).css({"text-decoration":"underline"});
                }
            });
        },
        strikethrough:function(rect){
            rect.setStyle(function(el){
                if($(el).css("text-decoration")=="line-through")
                    $(el).css({"text-decoration":"none"});
                else{
                    $(el).css({"text-decoration":"line-through"});
                }
            });
        },
        align_left:function(rect){
            rect.setStyle(function(el){
                $(el).css({"text-align":"left"});
            },true);
        },
        align_right:function(rect){
            rect.setStyle(function(el){
                $(el).css({"text-align":"right"});
            },true);
        },
        align_center:function(rect){
            rect.setStyle(function(el){
                $(el).css({"text-align":"center"});
            },true);
        },
        font_size:function(rect,name){
            $("[data-name="+name+"]").children("ul").children("li").children("a").mousedown(function(){
                var self = this;
                rect.setStyle(function(el){
                    $(el).css({"font-size":$(self).html()});
                })
                $(this).unbind("mousedown");
                return false;
            });
        },
        font_family:function(rect,name){
            $("[data-name="+name+"]").children("ul").children("li").children("a").mousedown(function(){
                var self = this;
                rect.setStyle(function(el){
                    $(el).css({"font-family":$(self).html()});
                })
                $(this).unbind("mousedown");
                return false;
            });
        },

        //todo 这是文本颜色
        edit:function(rect,name){
            $("[data-name="+name+"]").colorpicker({
                fillcolor:true,
                success:function(o,color){
                    rect.setStyle(function(el){
                        $(el).css({"color":color});
                    })
                }
            }); 
        },
        //todo 这是背景颜色
        magic:function(rect,name){
            $("[data-name="+name+"]").colorpicker({
                fillcolor:true,
                success:function(o,color){
                    rect.setStyle(function(el){
                        $(el).css({"background":color});
                    });
                }
            });
        },
        chevron_down:function(rect,name){
            rect.setStyle(function(el){
                var size = parseInt($(el).css("font-size").replace("px",""));
                size -= 1;
                $(el).css("font-size",size+"px");
            });
        },
        chevron_up:function(rect,name){
            rect.setStyle(function(el){
                var size = parseInt($(el).css("font-size").replace("px",""));
                size += 1;
                $(el).css("font-size",size+"px");
            });
        },
        calendar:function(rect,name){
            rect.addContent(CNDateString(new Date()));
        },
        time:function(rect,name){
            var now = new Date();
            rect.addContent(now.getHours()+":"+now.getMinutes()+":"+now.getSeconds());
        },
        list_ol:function(rect,name){
            rect.setStyle(function(el){
                if($(el).css("display").indexOf("list-item")>-1){
                    $(el).css({"list-style":"","display":""});
                }
                else{
                    $(el).css({"list-style":"decimal","display":"list-item"});
                }
            },true);
        },
        list_ul:function(rect,name){
            rect.setStyle(function(el){
                if($(el).css("display").indexOf("list-item")>-1){
                    $(el).css({"list-style":"","display":""});
                }
                else{
                    $(el).css({"list-style":"disc","display":"list-item"});
                }

            },true);
        },
        tablet:function(rect,name,slide){
            slide.setStyle(function(el){
                canvasDraw(el);
            })
        //    slide.append("<div class='rect'><span></span></div>");
        },
        star_empty:function(rect,name,slide){
            slide.setStyle(function(el){
                Animate.setEffect(el,'empty');
            },true);
        },
        star:function(rect,name,slide){
            slide.setStyle(function(el){
                Animate.setEffect(el,'fadeOut');
            },true);
        },
        star_half:function(rect,name,slide){
            slide.setStyle(function(el){
                Animate.setEffect(el,'boost');
            },true);
        },

        plane:function(rect,name,slide){
            slide.setStyle(function(el){
                Animate.setEffect(el,'erasure');
            },true);
        },
        line:function(rect,name,slide){
            $("[data-name="+name+"]").children("ul").children("li").children("a").mousedown(function(){
                if(this.innerHTML == "细"){
                    slide.draw('line',4);
                }
                else if(this.innerHTML == "中"){
                    slide.draw('line',6);
                }
                else if(this.innerHTML == "粗"){
                    slide.draw('line',8);
                }
                return false;
            })
        },
        picture:function(rect,name,slide){
            var shadow = $("<div style='z-index:100000' class='modal'><div class='modal-body'><input style='width:380px;margin:0 10px 0 0;'\
            id='url' type='text' placeholder='输入url或者直接拖入文件'><a href='#' id='imgEnter' class='btn btn-primary'>确认</a>\
            <a href='#' id='cancel' class='btn'>取消</a></div></div>");

            slide.setStyle(function(el){
                var p = $(el).parent();
                p.append(shadow);
                p.find('#cancel').click(function(){
                    shadow.remove();
                    $(this).unbind('click');
                })
                p.find('#imgEnter').click(function(){
                    shadow.remove();
                    $(this).unbind('click');
                    var img= new Image();
                    img.src =$('url').val()?$('url').val():"http://imgsrc.baidu.com/forum/pic/item/e6b14bc2a4561b1fe4dd3b24.jpg";
                  //  var url = $('url').val()?$('url').val():"http://imgsrc.baidu.com/forum/pic/item/e6b14bc2a4561b1fe4dd3b24.jpg";
                //    tran(url);

                    canvasDraw(el,img);
                })

                shadow.find("input").on("dragover",function(evt){
                    $(this).css("border","1px solid red");
                    evt.preventDefault(); 
                }).on("dragleave",function(evt){
                    $(this).css({"border":"0px solid black"});
                    evt.preventDefault(); 
                }).on("dragstart,dragenter,dragstart",function(evt){
                    evt.preventDefault();
                });

                shadow.find("input")[0].addEventListener("drop",function(event){   
                    var imgs = event.dataTransfer.files,dropArea = $(this);
                    for(var i = 0,len = imgs.length ; i < len ; i++){
                        (function(i){
                            var reader = new FileReader();
                            reader.onload = function(evt){
                                (function(evt){
                                    var img= new Image();
                                    img.src = evt.currentTarget.result;
                                    canvasDraw(el,img);

                                    shadow.remove();
                                })(evt);
                                $(this).css({"border":"0px solid black"});
                            };
                            reader.onerror = function(err){
                            }
                            reader.readAsDataURL(imgs[i]);
                        })(i);
                    }
                    event.preventDefault();
                },false);
            })
        }

    };

    var tran = function(url){
        var canvas = $("<canvas></canvas>")[0],ctx = canvas.getContext("2d"),img= new Image();
        $('body').append(canvas);
        img.src=url;
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img,0,0);
        }
    }

    ToolBar =toolBar;
}()); // Slide module
