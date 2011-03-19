
/**
 *Quadrant is a recursive quad-tree like structure that
 *breaks a given area progressivel into 4 quadrants.
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
    /* @property {Quadrant} ul Upper left */
    this.ul = null;
    /* @property {Quadrant} ll Lower left */
    this.ll = null;
    /* @property {Quadrant} ur Upper right*/
    this.ur = null;
    /* @property {Quadrant} lr Lower right*/
    this.lr = null;
    

}


/**
 *Does this quadrant contain this point?
 *
 *@TODO extract this to possible Shapes library
 *@argument x is either an X coordinate or a point
 *@argument {Integer} y
 */
Quadrant.prototype.contains  = function(x, y){
    return (x > this.x  && x < this.x + this.sx)
        && (y > this.y  && y < this.y + this.sy);
}

/**
 *High level Entity Add logic, focuses on where to route
 *a new entity.
 *
 *@property {x,y,sx,sy} All information needed to map out a box shape
 */
Quadrant.prototype.add = function(entity){
    
    //Does this quadrant divided already?
    if(this.lr || this.ll || this.ul || this.ur){
        this.loop(function(){
            if(entity.x > this.x && entity.x < this.x + this.sx){
                if(entity.y > this.y && entity.y < this.y + this.sy){
                    this.add(entity);
                }
            }
        });
    }
    //Should this quadrant be divided?
    else if(this.entities.length > 1 && this.depth > 0){
        //This Quadrant has become crowded, flush out all entities down the next level
        this.spawn();
        this.entities.push(entity);
        this.divide();
        
    }else{
        //No, push entity to this Quadrant
        this.entities.push(entity);
    }
}

/**
 *Spawns child nodes
 *
 */
Quadrant.prototype.spawn = function(){
    
    var sizeX = this.sx / 2;
    var sizeY = this.sy / 2;
    
    this.ul = new Quadrant(this.x,          this.y,         sizeX, sizeY,   this.depth - 1, "ul");     
    this.ur = new Quadrant(this.x + sizeX,  this.y,         sizeX, sizeY,   this.depth - 1, "ur");
    this.ll = new Quadrant(this.x,          this.y + sizeY, sizeX, sizeY,   this.depth - 1, "ll");
    this.lr = new Quadrant(this.x + sizeX,  this.y + sizeY, sizeX, sizeY,   this.depth - 1, "lr");
}

/**
 *Divide current Quadrant
 *
 */
Quadrant.prototype.divide = function(){
    var entity = null;
    while(entity = this.entities.pop()){
        this.loop(function(){
            if(entity.x > this.x && entity.x < this.x + this.sx){
                if(entity.y > this.y && entity.y < this.y + this.sy){
                    this.add(entity);
                }
            }
        })
    }
}


Quadrant.prototype.render = function(ctx, depth){
    ctx.strokeRect(this.x, this.y, this.sx, this.sy);
    this.loop(function(){
        this.render(ctx, depth - 1);
    });
}

Quadrant.prototype.loop = function(block){
    var retvals = [];
    var points = ["ul","ll",'ur','lr'];
    for(var i = 0; i < points.length; i++ ){
        if( this[points[i]] instanceof Quadrant ){
            retvals.push( block.call(this[points[i]], points[i]));
        }
    }
    return retvals;
}

Quadrant.prototype.find = function(x,y){
    var targets = [];
    if(this.contains(x,y)){
        targets.push(this)
    }else{
        return [];
    }
    this.loop(function(){
        targets = targets.concat(this.find(x,y));
    });
    return targets;
}

function QuadrantFactory(ctx, max){
    return new Quadrant(0,0, ctx.canvas.clientWidth, ctx.canvas.clientHeight, max || 4 )
}




(function(){
    console.log("Test here!");
}());



