
/**
 *
 *
 *@argument {Integer} mx Upper left x coordinate
 *@argument {Integer} my Upper left y coordinate
 *@argument {Integer} lx lower right x coordinate
 *@argument {integer} ly lower right y coordinate
 *@argument {Integer} depth determines how many more quadrants to descend down
 */
function Quadrant(x, y, sx, sy, depth, name){  
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.depth = depth - 1;
    this.entities = [];
    this.name = name || "root";
    /* @property {Quadrant} left */
    this.ul = null;
    /* @property {Quadrant} left */
    this.ll = null;
    /* @property {Quadrant} right */
    this.ur = null;
    /* @property {Quadrant} right */
    this.lr = null;
    if(this.depth > 0){
        var halfX = this.sx / 2;
        var halfY = this.sy / 2;
        this.ul = new Quadrant(this.x, this.y, halfX , halfY , depth - 1, this.name + " -> ul");
        
        this.ur = new Quadrant(this.x + halfX, this.y,  halfX , halfY , depth - 1, this.name + " -> ur");
        
        this.ll = new Quadrant(this.x, this.y + halfY , halfX , halfY , depth - 1, this.name + " -> ll" );

        this.lr = new Quadrant( this.x + halfX, this.y + halfY, halfX ,  halfY  , depth - 1, this.name + " ->lr");
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
    if( point[0] >= this.x && point[0] <= this.x + this.sx){
        if(point[1] >= this.y && point[1] <= this.y + this.sy){
            return true;
        }
    }
    
    return false;
    
}

Quadrant.prototype.add = function(entity){
    this.entities.unshift(entity);
}

Quadrant.prototype.render = function(ctx, depth){
    ctx.strokeRect(this.x, this.y, this.x + this.sx, this.y + this.sy);
    this.loop(function(){
        this.render(ctx, depth - 1);
    });
}

Quadrant.prototype.loop = function(block){
    var points = ["ul","ll",'ur','lr'];
    for(var i = 0; i < points.length; i++ ){
        if( this[points[i]] instanceof Quadrant ){
            try{
                block.call(this[points[i]], points[i]);                               
            }catch(e){
                if(console && console.log){
                    console.log(e);
                }
            }
        }
    }
}

Quadrant.prototype.find = function(point){
    var targets = [];
    if(this.contains(point)){
        targets.push(this)
    }else{
        return [];
    }
    targets.concat(this.loop(function(name){
        targets = targets.concat(this.find(point));
    }));
    return targets;
}

function EntityMap(ctx, max){
    this.maxX = ctx.canvas.clientWidth;
    this.maxY = ctx.canvas.clientHeight;
    this.maxZones = max || 4;
    this.root = new Quadrant(0,0,this.maxX , this.maxY , this.maxZones);
    
}

EntityMap.prototype.find = function(point){
    if(this.root.contains(point[0],point[1]) === false){
        return [];
    }
    return this.root.find(point);
    
}

/**
 *
 *@argument {CanvasRenderingContext2D} ctx
 */
EntityMap.prototype.render = function(ctx, depth){
    this.root.render(ctx, depth);
}


