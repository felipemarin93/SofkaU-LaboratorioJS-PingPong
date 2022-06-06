/**
 * @author Daniel Felipe Marin Giraldo
 * Función que contiene el tiempo, el movimiento, la barra de movimiento, ancho y alto 
 * ademas de los 2 jugadores del pingpong
 */

(function(){
    self.Board = function(width,height){
  this.width = width;
  this.height = height;
  this.playing = false;
  this.game_over = false;
  this.bars = [];
  this.ball = null;
  this.playing = false;
 }
/**
 * Metodo que retorna las barras que emulan las raquetas en el tablero
 */
 self.Board.prototype = { 
  get elements(){
   var elements = this.bars.map(function(bar){
    return bar;
   });
   elements.push(this.ball);
   return elements;
  }
 }
})();
/**
 * función creada para indicar movimiento, radio y velocidad de la bola, además la dirección de la misma
 */


(function(){
 self.Ball = function(x,y,radius,board){
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed_y = 0;
  this.speed_x = 3;
  this.board = board;
  this.direction = 1;
  this.bounce_angle = 0;
  this.max_bounce_angle = Math.PI / 12;
  this.speed = 3;

  board.ball = this;
  this.kind = "circle";
 }

 /**
 * función que aisgna dirección de la bola
 */

 self.Ball.prototype = {
   move: function(){
      this.x += (this.speed_x * this.direction);
      this.y += (this.speed_y);

   },
   get width(){
    return this.radius * 2;

   },
   get height(){
    return this.radius * 2;

   },

    /**
 * En esta Función de Coalision se indica el momento del choque de dos elementos, es decir,
 * cuando la bola se cruza con la raqueta o barra lateral
 */

   collision: function(bar){
    
    var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

    var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

    this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

    this.speed_y = this.speed * -Math.sin(this.bounce_angle);
    this.speed_x = this.speed * Math.cos(this.bounce_angle);

    if (this.x > (this.board.width / 2)) this.direction = -1;
    else this.direction = 1;

   }

  }

})();
/**
 * Función que indica la posición, el tipo el ancho y alto de las Barras, además de su velocidad
 * le define una posición X y Y dentro del tablero
 */
(function(){
 self.Bar = function(x,y,width,height,board){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.board = board;
  this.board.bars.push(this);
  this.kind = "rectangle";
  this.speed = 10;
 }

 self.Bar.prototype = {
  down: function(){
   this.y += this.speed;

  },
  up: function(){
   this.y -= this.speed;
  },
  toString: function(){
   return "x: "+ this.x +"y: "+ this.y ;
  }
 }
})();

/**
 * Función que inicia Canvas(ancho, alto y el del tablero, ademas se especifica juego 2D
 */


(function(){
 self.BoardView = function(canvas,board){
  this.canvas = canvas;
  this.canvas.width = board.width;
  this.canvas.height = board.height;
  this.board = board;
  this.cxt = canvas.getContext("2d");
 }

 self.BoardView.prototype = {
  clean: function(){
   this.cxt.clearRect(0,0,this.board.width,this.board.height);
  },
  draw: function(){
   for (var i = this.board.elements.length - 1; i >= 0; i--) {
    var el = this.board.elements[i];

    draw(this.cxt,el);
   };
  },

  /**
   * Funcion que chequea las coalisiones con un condicional que evalua
   */
  check_collisions: function(){
   for (var i = this.board.bars.length - 1; i >= 0; i--) {
    var bar = this.board.bars[i];
    if (hit(bar, this.board.ball)) {
     this.board.ball.collision(bar);

    }
   };

  },
  /**-
   * Funcion de juego para el inicio, limpiar y dibujas , ademas mover la bola
   */
  play: function(){
   if(this.board.playing){
   this.clean();
   this.draw();
   this.check_collisions();
   this.board.ball.move();
    }
  }

 }

 function hit(a,b){
  //Revisa si a colisiona con b
  var hit = false;
  //Colisiones hirizontales
  if(b.x + b.width >= a.x && b.x < a.x + a.width){

   //Colisiona verticales
   if (b.y + b.height >= a.y && b.y < a.y + a.height) 
    hit = true;
  }

  //Colisión de a con b
  if(b.x <= a.x && b.x + b.width >= a.x + a.width){
   
   if (b.y <= a.y && b.y + b.height >= a.y + a.height) 
    hit = true;
  }

  //Colision b con a
  if(a.x <= b.x && a.x + a.width >= b.x + b.width){
   //Colisiona verticales
   if (a.y <= b.y && a.y + a.height >= b.y + b.height) 
    hit = true;
  }
  return hit;
 }

 function draw(cxt,element){
  
  switch(element.kind){
   case "rectangle":
   cxt.fillRect(element.x,element.y,element.width,element.height);
   break;

   case "circle":
   cxt.beginPath();
   cxt.arc(element.x,element.y,element.radius,0,7);
   cxt.fill();
   cxt.closePath();
   break;
  }
 }
})();

/**
 * Se crean los objetos tipo tablero con sus respectivas posiciones
 */

  var board = new Board(800,400);
  var bar = new Bar(20,100,40,100,board);
  var bar_2 = new Bar(735,100,40,100,board);
  var canvas = document.getElementById('canvas');
  var board_view = new BoardView(canvas,board);
  var ball = new Ball(350,100,10,board);

  /**
   * Se cran los eventos listeners que indican enl movimiento de las barras
   */

document.addEventListener("keydown",function(ev){
 //console.log(ev.keyCode);
 if(ev.keyCode == 87){
     ev.preventDefault();  
  bar.up();
  
 }
 else if(ev.keyCode == 65){
  ev.preventDefault();
  bar.down();
 }
 else if(ev.keyCode == 68){
     ev.preventDefault();  
  bar_2.up();
 }
 else if(ev.keyCode == 90){
  ev.preventDefault();
  bar_2.down();
 }
 else if (ev.keyCode ===32){
  ev.preventDefault();
  board.playing = !board.playing;

 }


});

/**
 * Evento listener que carga el main del juego  y se envía una dirección a la bola
 */
board_view.draw();
window.requestAnimationFrame(controller);
setTimeout(function(){
  ball.direction = -2;
},4000);

function controller(){
  board_view.play(); 
  window.requestAnimationFrame(controller);

}