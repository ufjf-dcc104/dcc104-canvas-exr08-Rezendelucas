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
      }else{};;
    }
  // identificação dos ID de objetos em cena
  // 1 == Paredes ou Obstáculo intransponível
  // 2 == Player 1
  // 3 == Região Oculta
  // 4 == player 2
  // 5 == regiao vazia
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
          this.cells[i][j] = 2;
          pc1.x = (i+0.5)*this.SIZE;
          pc1.y = (j+0.5)*this.SIZE;
          pc1.imgKey = "pc";
          break;
        case 3:
          this.cells[i][j] = 3;
          break;
        case 4:
          this.cells[i][j] = 4;
          pc2.x = (i+0.5)*this.SIZE;
          pc2.y = (j+0.5)*this.SIZE;
          pc2.imgKey = "pc";
          break;
        case 5:
          this.cells[i][j] = 5;
          break;
        default:
          this.cells[i][j] = 0;
      }
    }
  }
};

Map.prototype.bomba = function (pc, ctx){

  pc.localizacao(this);  

  if(pc.cooldown == 0){
    var bomba = new Sprite();
    //bomba.y = (pc.localizacaoGY(this)+0.5)*this.SIZE;
    //bomba.x = (pc.localizacaoGX(this)+0.5)*this.SIZE;
    bomba.imgKey = "bomb";
    bomba.explodes = 2;
    bomba.x = pc.gx;
    bomba.y = pc.gy;
    pc.cooldown = 1;
      
    //this.cells[pc.gy][pc.gx] = 4;
    this.bombs.push(bomba);
  }
};

Map.prototype.bombaExplodes = function(dt, pc1 , pc2){
  
  //Localização do player 1 e player 2
  pc1.localizacao(this);  
  pc2.localizacao(this);


  for(i = this.bombs.length -1; i >=0; i--){
      if(this.bombs[i].timeoutBomba(dt)){
        
        //Verifica se o player 1 está no alcance da bomba
        pc1.gameOver(map, this.bombs[i]);
        
        //Verifica se o player 2 está no alcance da bomba  
        pc2.gameOver(map, this.bombs[i]);

        //Limpa o cenário
        if(this.cells[this.bombs[i].gy-1][this.bombs[i].gx] == 3){//cima
          this.cells[this.bombs[i].gy-1][this.bombs[i].gx] = 2;
        }
        if(this.cells[this.bombs[i].gy+1][this.bombs[i].gx] == 3){//baixo
          this.cells[this.bombs[i].gy+1][this.bombs[i].gx] = 2;
        }  
        if(this.cells[this.bombs[i].gy][this.bombs[i].gx+1] == 3){//direita
          this.cells[this.bombs[i].gy][this.bombs[i].gx+1] = 2;
        }
        if(this.cells[this.bombs[i].gy][this.bombs[i].gx-1] == 3){//esquerda
          this.cells[this.bombs[i].gy][this.bombs[i].gx-1] = 2;
        }
        this.cells[this.bombs[i].gy][this.bombs[i].gx] = 2;
        
        //Remove a bomba
        this.bombs.splice(i,1);
      } 
  }
};

Map.prototype.gameOver = function (map, bomba){  
  if(bomba.gx == this.gx && bomba.gy == this.gy){
    this.life = 0;
  }
  if(bomba.gx + 1 == this.gx && bomba.gy == this.gy){
    this.life = 0;
    //console.log("You Lose");
  }
  if(bomba.gx - 1 == this.gx && bomba.gy == this.gy){
    this.life = 0;
    //console.log("You Lose");
  }
  if(bomba.gx == this.gx && bomba.gy + 1 == this.gy){
    this.life = 0;
    //console.log("You Lose");
  }
  if(bomba.gx == this.gx && bomba.gy - 1 == this.gy){
    this.life = 0;
    //console.log("You Lose");
  }
}

