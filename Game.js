var canvas;
var ctx;
var map;
var pc1;
var pc2;
var gameOver = false;
var message;
var dt;
var images;
var anterior = 0;
var explosao = 50;

function init(){
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = 480;
  canvas.height = 480;
  ctx = canvas.getContext("2d");


  images = new ImageLoader();
  images.load("pc","pc.png");
  images.load("bomb","bomb.png");


  pc1 = new Sprite();  
  pc2 = new Sprite();
  
  map = new Map(Math.floor(canvas.height/40), Math.floor(canvas.width/40));
  map.images = images;
  map.setCells([
    [1,1,1,1,1,1,1,1,1,1],
    [1,2,5,3,1,3,3,3,3,1],
    [1,5,1,3,3,3,3,1,3,1],
    [1,3,1,3,1,1,5,3,3,1],
    [1,3,3,5,3,3,3,1,3,1],
    [1,3,1,3,1,3,3,3,3,1],
    [1,3,3,5,1,3,1,5,3,1],
    [1,3,1,1,3,3,1,1,5,1],
    [1,3,3,3,3,3,3,5,4,1],
    [1,1,1,1,1,1,1,1,1,1],
  ], pc1, pc2);
  initControls();
  requestAnimationFrame(passo);
}

function passo(t){
  dt = (t-anterior)/1000;
  requestAnimationFrame(passo);
  ctx.clearRect(0,0, canvas.width, canvas.height);
    
  if(!gameOver){
  
    map.bombaExplodes(dt,pc1,pc2);
    if(explosao <= 0){
      map.posExplosao(dt);
      explosao = 50;
    }
    pc1.mover(map, dt);
    pc2.mover(map, dt);

    map.desenhar(ctx, images);
    pc1.desenhar(ctx, images);
    pc2.desenhar(ctx, images);

    verificaVitoria();
    explosao--;
    anterior = t;

  }else{
    showInformations();
  }
}

function showInformations(){
    ctx.font="20px Verdana";
    ctx.fillStyle = "red";
    ctx.fillText(message, 150, 175);
};

function verificaVitoria(){
  if(pc1.derrota()){
    gameOver = true;
    message = "Player 2  WINS";
  }else if(pc2.derrota()){
    gameOver = true;
    message = "Player 1  WINS";
  }else{};
};

function initControls(){
  addEventListener('keydown', function(e){
    switch (e.keyCode) {
      case 13:
        pc2.colocaBomba(map, ctx);
        e.preventDefault();
        break;
      case 32:
        pc1.colocaBomba(map, ctx);
        e.preventDefault();
        break;
      case 37: //esquerda
        pc1.vx = -100;
        pc1.vy = 0;
        pc1.pose = 2;
        e.preventDefault();
        break;
      case 38: //cima
        pc1.vx = 0;
        pc1.vy = -100;
        pc1.pose = 3;
        e.preventDefault();
        break;
      case 39: //direita
        pc1.vx = 100;
        pc1.vy = 0;
        pc1.pose = 0;
        e.preventDefault();
        break;
      case 40: //baixo
        pc1.vx = 0;
        pc1.vy = 100;
        pc1.pose = 1;
        e.preventDefault();
        break;
      case 65: //esquerda
        pc2.vx = -100;
        pc2.vy = 0;
        pc2.pose = 2;
        e.preventDefault();
        break;
      case 68: //direita
        pc2.vx = 100;
        pc2.vy = 0;
        pc2.pose = 0;
        e.preventDefault();
        break;
      case 83: //baixo
        pc2.vx = 0;
        pc2.vy = 100;
        pc2.pose = 1;
        e.preventDefault();
        break;
      case 87: //cima
        pc2.vx = 0;
        pc2.vy = -100;
        pc2.pose = 3;
        e.preventDefault();
        break;
      default:
    }
  });
  addEventListener('keyup', function(e){
    switch (e.keyCode) {
      case 37: //esquerda
        pc1.vx = 0;
        pc1.pose = 6;
        break;
      case 38: //cima
        pc1.vy = 0;
        pc1.pose = 7;
        break;
      case 39: //direita
        pc1.vx = 0;
        pc1.pose = 4;
        break;
      case 40: //baixo
        pc1.vy = 0;
        pc1.pose = 5;
        break;
      case 65: //esquerda
        pc2.vx = 0;
        pc2.pose = 6;
        break;
      case 68: //direita
        pc2.vx = 0;
        pc2.pose = 4;
        break;
      case 83: //baixo
        pc2.vy = 0;
        pc2.pose = 5;
        break;
      case 87: //cima
        pc2.vy = 0;
        pc2.pose = 7;
        break;
      default:

    }
  });
}
