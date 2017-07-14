function Map(rows, collumns) {
  this.SIZE = 32;
  this.bombs = [];
  this.cells = [];
  for (var r = 0; r < rows; r++) {
    this.cells[r] = [];
    for (var c = 0; c < collumns; c++) {
      this.cells[r][c] = 0;
    }
  }
  this.images = null;
  this.cooldown = 0;
}

Map.prototype.desenhar = function (ctx, img) {

  for (var i = 0; i < this.bombs.length; i++) {
      this.bombs[i].desenharQuadrado(ctx);
      //this.bombs[i].desenharObjeto(ctx, img.images[this.bombs[i].imgKey]);
  }

 for (var r = 0; r < this.cells.length; r++) {
    for (var c = 0; c < this.cells[0].length; c++) {
      if(this.cells[r][c]==1){
        ctx.fillStyle = "brown";
        ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }else if(this.cells[r][c] == 3){
        ctx.fillStyle = "green";
        ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }else if(this.cells[r][c] == 2){
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }else if(this.cells[r][c] == 4){
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
     }else if(this.cells[r][c] == 5){
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }else if(this.cells[r][c] == 6){
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }else if(this.cells[r][c] == 7){
        ctx.fillStyle = "red";
        ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      };
    }
  // identificação dos ID de objetos em cena
  // 1 == Paredes ou Obstáculo intransponível
  // 2 == Player 1
  // 3 == Região Oculta
  // 4 == player 2
  // 5 == regiao vazia
  // 6 == regiao intransponivel
  // 7 == explosao
  }
};

Map.prototype.setCells = function (newCells , pc1 , pc2) {
  for (var i = 0; i < newCells.length; i++) {
    for (var j = 0; j < newCells[i].length; j++) {
      switch (newCells[i][j]) {
        case 1:
          this.cells[i][j] = 1;
          break;
        case 2:
          this.cells[i][j] = 5;
          pc1.x = (i+0.5)*this.SIZE;
          pc1.y = (j+0.5)*this.SIZE;
          pc1.imgKey = "pc";
          break;
        case 3:
          this.cells[i][j] = 3;
          break;
        case 4:
          this.cells[i][j] = 5;
          pc2.x = (i+0.5)*this.SIZE;
          pc2.y = (j+0.5)*this.SIZE;
          pc2.imgKey = "pc";
          break;
        case 5:
          this.cells[i][j] = 5;
          break;
        case 6:
          this.cells[i][j] = 6;
          break;
        default:
          this.cells[i][j] = 0;
      }
    }
  }
};

Map.prototype.bombaExplodes = function(dt, pc1 , pc2){
  
  //Localização do player 1 e player 2
  pc1.localizacao(this);  
  pc2.localizacao(this);


  for(i = this.bombs.length -1; i >=0; i--){
      if(this.bombs[i].timeoutBomba(dt)){


        this.bombs[i].localizacao(this);
        
        //Verifica se algum player está no alcance da bomba
        this.gameOver(this.bombs[i],pc1); 
        this.gameOver(this.bombs[i],pc2);   

        this.atualizaArredoresDaBomba(this.bombs[i],7);// atualiza com explosao
    } 
  }
};

Map.prototype.posExplosao = function(dt){
  for(i = this.bombs.length -1; i >=0; i--){
      if(this.bombs[i].timeoutBomba(dt)){
         this.bombs[i].localizacao(this);
         this.atualizaArredoresDaBomba(this.bombs[i],5)// apos o tempo de explosao atualiza para celula vazia
         this.bombs.splice(i,1);
          /*
          if(this.bombs[i].explodes > 0) {
              this.bombs[i].explodes -= dt;
          }else if(this.bombs[i].explodes <= 0) {
              this.atualizaArredoresDaBomba(this.bombs[i],5)// apos o tempo de explosao atualiza para celula vazia
              this.bombs.splice(i,1);
          }
         */   
      }
  }
};


Map.prototype.atualizaArredoresDaBomba = function(bombs, val){
  //atualiza ao redor da bomba
  if(!this.isParede(bombs.gy-1,bombs.gx)){//cima
    this.cells[bombs.gy-1][bombs.gx] = val;
    if(!this.isParede(bombs.gy-2,bombs.gx)){
        this.cells[bombs.gy-2][bombs.gx] = val;
      }
  }
  if(!this.isParede(bombs.gy+1,bombs.gx)){
    this.cells[bombs.gy+1][bombs.gx] = val;
    if(!this.isParede(bombs.gy+2,bombs.gx)){
        this.cells[bombs.gy+2][bombs.gx] = val;
      }  
  }
  if(!this.isParede(bombs.gy,bombs.gx-1)){
    this.cells[bombs.gy][bombs.gx-1] = val;
    if(!this.isParede(bombs.gy,bombs.gx-2)){
       this.cells[bombs.gy][bombs.gx-2] = val;
      }
  }
  if(!this.isParede(bombs.gy,bombs.gx+1)){
    this.cells[bombs.gy][bombs.gx+1] = val;
    if(!this.isParede(bombs.gy,bombs.gx+2)){
       this.cells[bombs.gy][bombs.gx+2] = val;
      }
  } 
  this.cells[bombs.gy][bombs.gx] = val;
};

Map.prototype.isEspaçoVazio = function(bombsGY,bombsGX){
  if(this.cells[bombsGY][bombsGX] == 3)
    return true;
  else
    return false;
};

Map.prototype.isParede = function(bombsGY,bombsGX){
  if(this.cells[bombsGY][bombsGX] == 1)
    return true;
  else
    return false;
};

Map.prototype.gameOver = function (bomba, pc){  
  if(bomba.gx == pc.gx && bomba.gy == pc.gy){
    pc.life = 0;
  }else if(bomba.gx + 1 == pc.gx && bomba.gy == pc.gy){
    pc.life = 0;
  }else if(bomba.gx + 2 == pc.gx && bomba.gy == pc.gy){
    pc.life = 0;
  }else if(bomba.gx - 1 == pc.gx && bomba.gy == pc.gy){
    pc.life = 0;
  }else if(bomba.gx - 2 == pc.gx && bomba.gy == pc.gy){
    pc.life = 0;
  }else if(bomba.gx == pc.gx && bomba.gy + 1 == pc.gy){
    pc.life = 0;
  }else if(bomba.gx == pc.gx && bomba.gy + 2 == pc.gy){
    pc.life = 0;
  }else if(bomba.gx == pc.gx && bomba.gy - 1 == pc.gy){
    pc.life = 0;
  }else if(bomba.gx == pc.gx && bomba.gy - 2 == pc.gy){
    pc.life = 0;
  }else{};
};

