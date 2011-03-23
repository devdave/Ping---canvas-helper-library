
    function GUID(){
        return new Date().getTime() +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + 
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    
    function Ball(maxX, maxY){
        this.id = GUID();
        this.x = Math.random()*maxX;
        this.y =Math.random()*maxY;
        this.sx = 10;
        this.sy = 10;
        this.dx =Math.random()*20 -10;
        this.dy =Math.random()*20 -10;
    }
    Ball.prototype.bbox = function(){
        return {"x": this.x-50, y:this.y-50,sx:100,sy:100}
    }
    Ball.prototype.step = function(){
        this.x += this.dx;
        this.y += this.dy;
    }

    function ballFactory(maxX, maxY){
        return new Ball(maxX, maxY)
    }
                
    /**
     *Unfortunately this closure is a performance bottleneck
     *but not sure how to work around it
     */
    function RunBall(ball, map){      
        
        
        ball.dx = ball.dx * .95;
        ball.dy = ball.dy * .95;
        if(Math.abs(ball.dx) < 1){
            ball.dx = ball.dx > 0 ? 1 : -1;
        }
        if(Math.abs(ball.dy) < 1){
            ball.dy = ball.dy > 0 ? 1 : -1;
        }
        
        if(! ping.Lib.util.inside(ball.x, 0, 600)){
            ball.dx *= -1;
        }
        if(! ping.Lib.util.inside(ball.y, 0, 400)){
            ball.dy *= -1;
        }
        
        return ball;
        }
        
    function RenderBall(ball, map, ctx){
        var ballBoundBox = {};
        var Bbox = ball.bbox();
        var qs = map.findBox(Bbox, qs);
        var entity = null, quad = null, dist = null, color = "blue";
        for(var i = qs.length - 1; i >= 0; i--){
            if(qs[i].entities){
                var quad = qs[i];
                for(var e = 0; e < quad.entities.length; e++ ){
                    entity = quad.entities[e];
                    if(entity.id != ball.id){
                        dist = ping.Lib.pointDistance(ball.x, ball.y, entity.x, entity.y);
                        if(ping.Lib.intersects.box(Bbox, entity.bbox())){
                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = "RGB(64,90,"+ 256 - Math.round(dist)+")";
                            ctx.moveTo(Math.round(ball.x),Math.round(ball.y));
                            ctx.lineTo(Math.round(entity.x), Math.round(entity.y));
                            ctx.closePath();
                            ctx.stroke();
                            ctx.restore();
                        }
                        if(dist < 10){
                            color = "red";
                            var rXFactor = Math.random() * 100 / 100;
                            entity.dx *= -1 + rXFactor;
                            entity.dy *= -1 + rXFactor;
                            break;
                            
                        }
                    }
                }

            }
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(Bbox.x, Bbox.y,100,100);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle  = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        
        ctx.circle(ball.x,ball.y,10);
        ctx.closePath();
        ctx.fill();
        //ctx.fillRect(ball.x,ball.y,10,10);
        ctx.restore();
        return ball;
    }   
    
    
    function zf( number )
    {
      var width = 3;
      width -= number.toString().length;
      if ( width > 0 )
      {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number;
    }
    
    function traversal(node, parent){
            
            if(this instanceof Quadrant){
                node = this;
            }
            
            var liNode = "<li>";
            liNode += "\n " + node.name
                            + " - "
                            + node.depth
                            + "["
                            + zf(node.x)
                            + ","
                            + zf(node.y)
                            + "] "
                            + "["
                            + zf(node.sx)
                            + ","
                            + zf(node.sy)
                            + "]";
            
            var temp = node.loop(traversal);
            if(temp.length > 0){
                var subTemp = temp.join("\n");
                
                liNode += "<ul>" + subTemp + "</ul>";
            }
            liNode += "</li>";
            return liNode;
        }