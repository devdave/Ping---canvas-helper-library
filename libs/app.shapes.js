

app.namespace("appLib");

appLib.pointDistance = function(x1,y1,x2,y2){
        var tX = Math.pow(x1 - x2, 2);
        var tY = Math.pow(y1 - y2, 2);
        return Math.sqrt((tX) + (tY));
}

appLib.Point = function (x, y) {
        this.x = x;
        this.y = y;
    };

app.w(appLib.Point, function () {
    

    this.dist = function (o) {
        return appLib.pointDistance(this.x,o.x,this.y,o.y);
    };


    /**
     *Bad design choice     
     *@deprecated */
    this.slope = function (o) {
        return (this.y - o.y) / (this.x - o.x);
    };
});


appLib.Line = function (begin, end) {    
        this.begin = begin;
        this.end = end;    
    };
    
app.w(appLib.Line, function () {
    
    this.COINCIDENT   = 0x1 << 1;
    this.PARALLEL     = 0x1 << 2;
    this.NO_INTERSECT = 0x1 << 3;
    this.INTERSECT    = 0x1 << 4;
    
    this.slope = function (firstForm) {    
        return this.begin.slope(this.end);
    };
    
    this.dist = function () {
        return this.begin.dist(this.end);
    };
    
    this.intersect = function (o) {
    
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
    
});

appLib.boxfactory = function (){
        var oP, size;
        
        if(arguments.length == 3){
            oP = new appLib.Point(arguments[0], arguments[1]);
            size = arguments[2]
        }else if(arguments.length == 2){
            oP = arguments[0];
            size = arguments[1];            
        }else{
            throw new app.Exception("appLib.boxFactory expects (point, size) or (x, y, size) only");
        }
        
        var p1 = new appLib.Point(oP.x, oP.y);
        var p2 = new appLib.Point(oP.x + size, oP.y);
        var p3 = new appLib.Point(oP.x + size, oP.y + size);
        var p4 = new appLib.Point(oP.x, oP.y + size );
        
        var l1  = new appLib.Line(p1, p2)                                         
        var l2 = new appLib.Line( l1.end, p3 );                
        var l3 = new appLib.Line( l2.end, p4);                                                                                   
        var l4 = new appLib.Line( l3.end, l1.begin );
        return [l1,l2,l3,l4];
}