
ping.namespace("game.Lib");

game.Lib.GridCount = -1;

game.Lib.GridCell  = function(x,y,sx,sy,ix,iy){
                        this.x = x;
                        this.y = y;
                        this.sx = sx;
                        this.sy = sy;
                        this.ix = ix;
                        this.iy = iy;
                        this.id = ping.Lib.util.GUID();
                        this.data = {};   
                    }
                    
                    function appendData(k,value){
                        this.data[k] = value;
                    }
                    
                    function get(k, d){
                        if(typeof this.data[k] != "undefined"){
                            return this.data[k];
                        }
                        return d;
                    }

game.Lib.Grid      = (function (){
                        
                        /**
                         * @class
                         * @param {nsIDOMCanvasRenderingContext2D} ctx Canvas reference
                         * @property {nsIDOMCanvasRenderingContext2D} canvas  A Canvas reference
                         */
                        function Grid(ctx, pX, pY){
                            this.canvas = ctx;
                            this.maxX = ctx.maxWidth();
                            this.maxY = ctx.maxWidth();                            
                            this.bX = ctx.maxWidth() * pX;
                            this.bY = ctx.maxHeight() * pY;
                            
                            this.geo = [];
                            this.cells = [];
                            var cellCount = 0; //Used for sanity checking the list
                            this.geoIndex = null;
                            
                            for(var iX = 0; iX < this.bX; iX++){                                
                                var x = iX * this.bX;
                                for(var iY = 0; iY < this.bY; iY++){
                                    var y = iY * this.bY;
                                    var box = new Cell(x, y, this.bX, this.bY, iY, iX );
                                    var geoIndex = this.index(x, y, this.maxX, this.maxY);
                                    this.geo[geoIndex] = box;
                                    var cellIndex = this.index(iX, iY, this.bX, this.bY);
                                    this.cells[cellIndex] = box;                                    
                                    cellCount++;
                                }                                
                            }
                            
                        }
                        /**
                         * Coordinate to base N conversion where N is the larger
                         * line in a 2D plane.
                         *
                         * For a 10x10 grid, pos 0 == 0,0; 11 == 1, 1; 47 = 4,7
                         * For a 5x5 gride, pos 0 == 0,0; 7   == 1, 2; 23 = 4, 3;
                         *
                         * Note origin MUST start @ 0,0
                         *
                         */
                        Grid.prototype.index = function(x, y, maxX, maxY){                            
                            if(maxX > maxY){
                                return maxX * x + y;                                
                            }
                            else{
                                return maxY * y + x;
                            }     
                        }
                        
                        Grid.prototype.findAjacentCells = function(x,y){
                            var directions =[
                                                 ['nw',-1,-1], ['n',0,-1], ['ne',1, -1]
                                                ,['w', -1, 0]            , ['e',1, 0]
                                                ,['sw',-1, 1], ['s',0, 1], ['se', 1, 1]
                                            ];
                            var index = -1;
                            var dir   = null;
                            var nodes = {}
                            for(var d = 0; d < directions.length; d++){
                                dir = directions[d];
                                index = this.index(x + dir[1],y + dir[2], this.bX, this.bY);
                                if(index >= 0 && typeof this.cells[index] != "undefined"){
                                    nodes[dir[0]] = this.cells[index];
                                }
                            }
                            return nodes;

                        }
                        
                        Grid.prototype.render = function (){
                            this.canvas.beginPath();
                            for(var o = 0; o < this.grid.length; o++){
                                for(var i = 0; i < this.grid[o].length; i++){
                                    
                                    var box = this.grid[o][i]                                    
                                    this.canvas.moveTo(box.x, box.y)
                                    this.canvas.strokeRect(box.x, box.y, box.sx, box.sy);
                                    
                                }
                            }
                            this.canvas.closePath();                                    
                        }
                        
                        return Grid;
}())

game.Lib.DblBuffer = (function(){
    
                /**
                 * @class
                 * 
                 * @param {nsIDOMCanvasRenderingContext2D} ctx1
                 * @param {nsIDOMCanvasRenderingContext2D} ctx2
                 *
                 * @property {nsIDOMCanvasRenderingContext2D} canvas
                 * @property {nsIDOMCanvasRenderingContext2D} backGround
                 */
                function DblBuffer(ctx1,ctx2){
                    this.canvas = ctx ;
                    this.backGround = ctx2;
                    
                    this.buildBG();
                }
                
                var self = DblBuffer.prototype;
                self.buildBG = function(){
                    
                }
                
                return DblBuffer
    }())