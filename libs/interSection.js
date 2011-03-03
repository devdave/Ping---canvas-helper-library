

var app = {};
var appLib = {};

appLib.Point = function (x, y) {
    this.x = x;
    this.y = y;
};

appLib.Point.prototype.dist = function(o){
    var tX = Math.pow(this.x - o.x, 2);
    var tY = Math.pow(this.y - o.y, 2);
    return Math.sqrt((tX) + (tY))
}

appLib.Point.prototype.slope = function(o){
    (this.y - o.y) / (this.x - o.x);
}

appLib.Line = function (begin, end) {    
    this.begin = begin;
    this.end = end;    
};

appLib.Line.prototype.COINCIDENT   = 0x1 << 1;
appLib.Line.prototype.PARALLEL     = 0x1 << 2;
appLib.Line.prototype.NO_INTERSECT = 0x1 << 3;
appLib.Line.prototype.INTERSECT    = 0x1 << 4;

appLib.Line.prototype.slope = function(firstForm){
    
    return this.begin.slope(this.end);
}

appLib.Line.prototype.dist = function(){
    return this.begin.dist(this.end);
}


appLib.Line.prototype.intersect = function (o) {
    
    //TODO - recyle slopes to cut down expressions    
    var denom =   ((o.end.y - o.begin.y) * (this.end.x - this.begin.x)) - ((o.end.x - o.begin.x) * (this.end.y - this.begin.y));       
    var nume_a =  ((o.end.x - o.begin.x) * (this.begin.y - o.begin.y)) - ((o.end.y  - o.begin.y) * (this.begin.x - o.begin.x));       
    var nume_b =  ((this.end.x - this.begin.x) * (this.begin.y - o.begin.y)) - ((this.end.y - this.begin.y) * (this.begin.x - o.begin.x));
    
    if (denom == 0) {
        if (nume_a == 0 && nume_b == 0) {
            return [this.COINCIDENT];
        } else {
            return [this.PARALLEL];
        }
        
    }    
    var ua = nume_a / denom;
    var ub = nume_b / denom;
    
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        var x = this.begin.x + ua * (this.end.x - this.begin.x);
        var y = this.begin.y + ua * (this.end.y - this.begin.y);
        return [this.INTERSECT, x, y];
    }
    
    return [this.NO_INTERSECT];    
    
};