var DataPersistence;
(function () {

    var SERVER = "http://cppt.browser.360.cn/post/proxy/x/fsystem/y";
    var LOC = {fileSave:{addr:SERVER+"/save",param:{app:"cloud_ppt",meta:""}},fileRead:{addr:SERVER+"/read",param:{app:"cloud_ppt",file_id:""}},fileList:{addr:SERVER+"/list",param:{app:"cloud_ppt"}},fileView:{addr:SERVER+"/view",param:{app:"cloud_ppt"}},fileDelete:{addr:SERVER+"/delete",param:{app:"cloud_ppt",file_id:""}}};

    function data(){
     //   this.dataBase = openDatabase("cloud_ppt","1.0","云ppt",1024*1024);
     /*   this.dataBase.transaction(function(tx){
            tx.executeSql("create table if not exists cppt(id real unique,content text,meta text)",[],function(){

            });
        })*/
    }

    function _linkParse(adr){
        var par = "";
        for(var i in adr.param){
            par += i+"="+adr.param[i]+"&";
        }
        return adr.addr + "?" + par;
    }

    data.prototype.save = function(body,meta,func){
        var t = new Date();
        meta.timer = t.getFullYear + '-' + t.getMonth-1 + '-' + t.getDay;
        var self = this;
        this.body = body;
        LOC.fileSave.param.meta = JSON.stringify(meta);
        if($(body).data("file_id"))
            LOC.fileSave.param.file_id = $(body).data("file_id");
        else{
            delete LOC.fileSave.param.file_id;
        }
        var b = body.innerHTML.replace(/(^\s*)|(\s*$)/g, "");

        $.post(_linkParse(LOC.fileSave),b,function(e){
            if(e){
                var d = JSON.parse(e);
                if(d.file_id){
                    self.id = d.file_id;
                    $(body).data("file_id",d.file_id);
                }
                if(func)func(d);
            }
            if(self.id){

            }
            else{
          /*      self.dataBase.transaction(function(tx){
                    tx.executeSql('insert into cppt(id,content,meta) value ("'+self.id+'","'+b+'","'+meta+'")');
                })*/
            }
        });
    }

    data.prototype.saveImg = function(img,meta,func){
        LOC.fileSave.param.meta = JSON.stringify(meta);
        $.post(_linkParse(LOC.fileSave),img,function(e){
            var d = JSON.parse(e);
            if(func)func(d);
        });
    }

    data.prototype.read = function(body,id,func){
        LOC.fileRead.param.file_id = id;
        $.get(_linkParse(LOC.fileRead),function(e){
            $(body).data("file_id",id);
            body.innerHTML = e;
            if(func)func(e);
        })
    }

    data.prototype.view = function(func){
        $.get(_linkParse(LOC.fileView),function(e){
   //         if(func)func(JSON.parse(e));
        })
    }

    data.prototype.list = function(func){
        $.get(_linkParse(LOC.fileList),function(e){
      //      console.log(e);
            if(e){
                if(func)func(JSON.parse(e));    
            }
            else{
                if(func)func(window)
            }
            
        })
    }

    data.prototype.del = function(id,func){
        var self = this;
      //  console.log(_linkParse(LOC.fileDelete));
        LOC.fileDelete.param.file_id = id;
        $.get(_linkParse(LOC.fileDelete),function(e){
            func(e);
         //   $(self.body).data("file_id","");
          //  if(func)func(JSON.parse(e));
        })
    }

    data.prototype.openChannel = function(id){
        var self = this;
        var addr = 'ws://frontend.browser.360.cn:8080/channel/'+id;
        this.socket = new WebSocket(addr);  
        this.socket.onopen = function(event) { 
          self.socket.send('I am the client and I\'m listening!');
          self.socket.onmessage = function(event) { 
            if(event.data == "next"){
                editor.next();
            }
            else if(event.data == "last"){
                editor.last();
            }
            else if(event.data == "test"){

            }
          };
          self.socket.onclose = function(event) { 
            console.log('Client notified socket has closed',event); 
          };
        };
    }

    data.prototype.send = function(e){
        self.socket.send(e);
    }

    data.prototype.closeChannel = function(){
        this.socket.close();
    }

    DataPersistence = new data();
})()