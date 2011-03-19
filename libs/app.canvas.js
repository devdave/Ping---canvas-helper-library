
app.namespace("appLib");

appLib.CnvMan = function(){
     this.refs = {};
     this.count = 0;
}
appLib.CnvMan.prototype._set = function(id, ref){
   this.refs[id] = ref;
   this.count += 1;
}
appLib.CnvMan.prototype.get = function(id){
    if( typeof this.refs[id]  == "undefined"){
         this._set(id, appLib.$C(id));
    }
    return this.refs[id];
}

appLib.CnvMan.prototype.set = function(id, reference){
    if( typeof this.refs[id] == "undefined"){
         this._set(id, reference);
    }
    return this.refs[id];
}
appLib.CnvMan.prototype.exists = function(id){
   return typeof this.refs[id] != "undefined";
}


/**
 *Keeps a record of every extended canvas made
 */
app.cMngr = new appLib.CnvMan();


appLib.$C = function(elemId){
   if(app.cMngr.exists(elemId)){
       return app.cMngr.get(elemId);
   }
   var element = document.getElementById(elemId);
   var ref = element.getContext("2d");
   return app.cMngr.set(elemId, ref);
}

CanvasRenderingContext2D.prototype.render = function(block){
                        this.beginPath();
                        //@TODO add try/catch here?
                        block.call(this);
                        this.closePath();
                        return this;
}


CanvasRenderingContext2D.prototype.drawLine = function(p1, p2){
                            this.render(function(){
                               this.line(p1,p2);                        
                            });
                            this.ctx.stroke();
                    };
    
    
    /**
     *Given a Radi & angel value, return points on a circle
     */
CanvasRenderingContext2D.prototype.rayGen = function(Radius, angle, x, y){
                       var radian = angle * Math.PI/180;
                        var lx = Radius * (Math.cos(radian)) + x;
                        var ly = Radius * (Math.sin(radian)) + y;
                        return [lx, ly];
                };
                
CanvasRenderingContext2D.prototype.elipGen = function(Radius, angle, originX, originY, ratio ){
                        ratio = /*ratio ||*/ 1.8;
                        var radian = angle * Math.PI/180;
                        var lx = (Radius * (Math.cos(radian)* ratio) + originX) ;
                        var ly = Radius * (Math.sin(radian) * .5) + originY;
                        return [lx, ly];
};

CanvasRenderingContext2D.prototype.line = function(p1, p2){
            
                    this.render(function(){
                        this.moveTo(p2.x, p2.y);                        
                        this.lineTo(p1.x, p1.y);                    
                    });
                };
    
CanvasRenderingContext2D.prototype.circle = function(x, y, radius) {
                        return this.arc(x, y, radius, 0, Math.PI* 2, true);
                        };
                        
CanvasRenderingContext2D.prototype.drawCircle = function(x, y, radius){
                        this.beginPath();
                        this.circle(x,y,radius);
                        this.closePath();
}
CanvasRenderingContext2D.prototype.pixel    = function(point, color){
                        this.save();
                        this.moveTo(point[0],point[1]);
                        this.fillStyle = color;
                        this.fillRect(point[0],point[1],1,1);
                        this.restore();
}
CanvasRenderingContext2D.prototype.putPixel = function(x,y, color){
                        if(arguments.length == 1){
                          var point = x;
                        }else{
                          var point = [x,y];
                        }
                        color = color || "white";
                        this.pixel(point, color)
    }

CanvasRenderingContext2D.prototype.floodFill = function(color){
                        this.save();
                        this.fillStyle  = color;                 
                        this.fillRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);                     
                        this.restore();
                        }

CanvasRenderingContext2D.prototype.clearAll = function(color){
                        this.clearRect(0,0,this.canvas.clientWidth, this.canvas.clientHeight );
                        }

}