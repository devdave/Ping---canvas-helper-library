
/**
 *
 *
 *@argument {Integer} mx Upper left x coordinate
 *@argument {Integer} my Upper left y coordinate
 *@argument {Integer} lx lower right x coordinate
 *@argument {integer} ly lower right y coordinate
 *@argument {Integer} depth determines how many more quadrants to descend down
 */
function Quadrant(mx, my, sx, sy, depth){  
    this.mx = mx;
    this.my = my;
    this.sx = sx;
    this.sy = sy;
    this.depth = depth;
    this.entities = [];
    /* @property {Quadrant} left */
    this.ul = null;
    /* @property {Quadrant} left */
    this.ll = null;
    /* @property {Quadrant} right */
    this.ur = null;
    /* @property {Quadrant} right */
    this.lr = null;
    console.group("Quadrant");
    console.log("", [this.mx, this.my], [this.sx, this.sy], this.depth);
    if(depth > 0){
        console.log("ll");
        this.ul = new Quadrant(this.mx, this.my, (this.sx/2) + this.mx , (this.sy / 2) + this.my , depth - 1);
        
        console.log("ur");
        this.ur = new Quadrant(this.mx + ( this.sx / 2 ), this.my, this.sx, this.sy, depth - 1);
        
        console.log("ll");
        this.ll = new Quadrant(this.mx, this.my + ( this.sy / 2 ) , this.sx / 2 ,  this.sy / 2 , depth - 1  );

        console.log("lr");
        this.lr = new Quadrant( this.mx + ( this.sx / 2 ), this.my + (this.sy / 2), this.sx / 2 ,  this.sy / 2  , depth - 1);
    }
    console.groupEnd();
}

/**
 *Does this quadrant contain this point?
 *
 *@argument x is either an X coordinate or a point
 *@argument {Integer} y
 */
Quadrant.prototype.contains  = function(x, y){
    var point = (arguments.length == 1) ? x : [x,y];
    if( point[0] > this.mx && point[0] < this.lx){
        if(point[1] > this.ly && point[1] < this.ly){
            return true;
        }
    }
    
    return false;
    
}

Quadrant.prototype.add = function(entity){
    this.entities.unshift(entity);
}

Quadrant.prototype.render = function(ctx, depth){
    ctx.strokeRect(this.mx, this.my, this.mx + this.sx, this.my + this.sy);
    var points = ["ul","ll",'ur','lr'];
    for(var i = 0; i < points.length; i++ ){
        if( this[points[i]] instanceof Quadrant ){
            this[points[i]].render(ctx, depth - 1);                
        }
    }
}


function EntityMap(ctx){
    this.maxX = ctx.canvas.clientWidth;
    this.maxY = ctx.canvas.clientHeight;
    this.maxZones = 4;
    this.root = new Quadrant(0,0,this.maxX , this.maxY , this.maxZones);
    
}

/**
 *
 *@argument {CanvasRenderingContext2D} ctx
 */
EntityMap.prototype.render = function(ctx, depth){
    this.root.render(ctx, depth);
}


