  function Planet(origin, radius, size, speed, color, isPlanet){
            this.origin = origin;
            this.radius = radius;
            this.size  = Math.floor(size);
            this.speed = Math.round( Math.max(1, speed) * 100 ) / 100;
            this.color = color;
            this.position = Math.random() * 360;
            this.isPlanet = isPlanet || false;
            
            this.children = [];
            
            if(isPlanet){
                var cCount = Math.floor(Math.random() * 2);
                for(var i = 0; i < cCount; i++ ){
                    var childRadius = Math.max( Math.random() * 15,  Math.random() * 12  );
                    var childSize   = Math.max(1, size * .5);
                    var childSpeed  = Math.random() * 4;
                    var child = new Planet(origin, childRadius, childSize , childSpeed, color, false);
                    this.children.unshift(child);
                }

            }
            
            
        }
        
        Planet.prototype.drawOrbit = function(ctx){
            var i = 0;
            var method = (this.isPlanet || true) ? ctx.elipGen : ctx.rayGen;
            var startOrigin = method.call(ctx, this.radius, 0, this.origin[0], this.origin[1] );
            var origin = method.call(ctx, this.radius, i+2, this.origin[0], this.origin[1] );
            
            
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            for(var i = 1; i < 360; i++){
                
                ctx.moveTo(startOrigin[0], startOrigin[1]);
                ctx.lineTo(origin[0], origin[1]);
                var startOrigin = method.call(ctx, this.radius, i, this.origin[0], this.origin[1] );
                var origin = method.call(ctx, this.radius, i+2, this.origin[0], this.origin[1] );
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        Planet.prototype.updateOrigin = function(origin){
            this.origin = origin;
        }
        
        
        Planet.prototype.render = function(ctx){
            this.position = this.position + this.speed;
            if(this.position > 360){
                this.position = 0;
            }
            this.drawOrbit(ctx);
            var method = (this.isPlanet || true) ? ctx.elipGen : ctx.rayGen;              

            var origin = method.call(ctx, this.radius, this.position, this.origin[0], this.origin[1]);
            
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            var mySize = this.size;
            ctx.render(function(){                    
                    this.arc(origin[0], origin[1], mySize, 0, Math.PI * 2, true);
            });
            ctx.fill();
            for(var c = 0; c < this.children.length ; c++){
                this.children[c].updateOrigin(origin);                
                this.children[c].render(ctx);
                $("#specs").append($("<li>").text( " Child size " + this.children[c].size  + " speed " + this.children[c].speed + " radius " + this.children[c].radius) )
            }
            
            
        }
        
        
        function MainLoop(){
            
            this.genPlanets();
                    
            /**
             *@property {CanvasRenderingContext2D} ctx The canvas interface
             */
            this.ctx = appLib.$C("myCan");
            this.ctx.strokeStyle = "black";
        }
        MainLoop.prototype.genPlanets = function(){
            this.planets = [];
            var i = 0;
            var planets = [];
            planets[i++] = [20, 0];
            planets[i++] = [8, 42];
            //planets[i++] = [7, 58];
            planets[i++] = [8, 75];
            //planets[i++] = [7, 91];
            planets[i++] = [10, 110];
            //planets[i++] = [8, 127];
            planets[i++] = [7, 143];
            //planets[i++] = [7, 159];
            planets[i++] = [8, 176];
            
                        
            for(var p = 0; p < planets.length; p++){
                var size = planets[p][0];
                var radius =  planets[p][1];
                var speed =  100 / radius;//  Math.random() * ;
                var planet = new Planet([400,300],radius, size, speed , "white"  , p != 0);
                this.planets.unshift(planet);
            }
        }
        MainLoop.prototype.tick = function(){
              
              
              this.ctx.floodFill("black");
              this.ctx.fillStyle = "white";
              this.ctx.strokeStyle = "white";
              $("#specs").empty();
              for(var i = 0; i< this.planets.length; i++){
                  planet = this.planets[i];
                  planet.render(this.ctx);
                  $("#specs").append($("<li>").text( " size " + planet.size  + " \nspeed " + planet.speed + " \nradius " + planet.radius) )
              }
              
              
            };
                            
        game = new MainLoop();
        
        function interval(){
            game.tick();
        }
        
        $(function(){
                
                //ctx.c.circle(150, 150, 40);
                intHandle = setInterval(interval, 50);
                
                
        });