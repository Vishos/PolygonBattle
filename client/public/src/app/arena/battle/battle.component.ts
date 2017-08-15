import { Component, OnInit } from '@angular/core';
import { HttpService } from "../../http.service";

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {
  player;
  canvas;
  canvas2;
  ctx;
  ctx2;
  canvasInterval;
  drawInterval;
  roundInterval;
  movement;
  bullets;
  canShoot;
  obstacles;
  round;
  gameOver;
  canCollide;
  gamePaused;

  constructor(private _httpService:HttpService) {
     
    this.player = { stats:{
          rateOfFire: 1000,
          speedOfProjectile: 10,
          sides: 3,
          color:"#ff0000",
          Xcenter: 100,
          Ycenter: 100,
          size: 20,
          armed:[true,true,false, true, true, true, true, true, true, true]
        }
      }
    this.setup();
  
   }// end constructor

  ngOnInit() {
  }

  setup(){
    this.gameOver = false;
    this.obstacles = [];
    this.round = 1;
    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false
    };

    this.canShoot = true;

    document.addEventListener('keydown', (event)=> {
        switch (event.keyCode) {
          case 65: // A
            this.movement.left = true;
            break;
          case 87: // W
            this.movement.up = true;
            break;
          case 68: // D
            this.movement.right = true;
            break;
          case 83: // S
            this.movement.down = true;
            break;
          case 32: //Spacebar
            this.movement.shoot = true;
            break;
          case 38: //up arrow
            this.movement.up = true;
            break;
          case 40: //down arrow
            this.movement.down = true;
            break;
          case 37: //left arrow
            this.movement.left = true;
            break;
          case 39: //right arrow
            this.movement.right = true;
            break;
          case 80: // P
            this.pauseGame();
            break;
        }
      });
      document.addEventListener('keyup', (event)=> {
        switch (event.keyCode) {
          case 65: // A
            this.movement.left = false;
            break;
          case 87: // W
            this.movement.up = false;
            break;
          case 68: // D
            this.movement.right = false;
            break;
          case 83: // S
            this.movement.down = false;
            break;
          case 32: //Spacebar
            this.movement.shoot = false;
            break;
          case 38: //up arrow
            this.movement.up = false;
            break;
          case 40: //down arrow
            this.movement.down = false;
            break;
          case 37: //left arrow
            this.movement.left = false;
            break;
          case 39: //right arrow
            this.movement.right = false;
            break;
        }
      });

    //Setup the canvas
    this.canvasInterval = setInterval(()=>{
      this.canvas = document.getElementById("canvas1");
      if(this.canvas){
        this.ctx = this.canvas.getContext('2d');
        this.canvas2 = document.createElement("canvas");
        this.canvas2.setAttribute("id", "canvas2");
        this.canvas2.style.position = "absolute";
        let rect = this.canvas.getBoundingClientRect();
        console.log(`rect = ${rect.top}, ${rect.left}`)
        this.canvas2.style.top = `${rect.top}px`;
        this.canvas2.style.left = `${rect.left}px`;
        this.canvas2.style.zIndex = "1";
        document.body.appendChild(this.canvas2);
        this.canvas2 = document.getElementById("canvas2");
        this.ctx2 = this.canvas2.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas2.width = 800;
        this.canvas2.height = 600;
        clearInterval(this.canvasInterval);
      }
    }, 20);

    this.drawInterval = setInterval(()=>{
      if(this.ctx){
        this.draw();
      }
    }, 15);

  } //end setup

   draw(){
     if(this.gameOver){
       this.endGame();
     }
     this.ctx.clearRect(0, 0, 800, 600);
     this.canShoot += 15;
     if(this.canShoot > this.player.stats.rateOfFire){
       this.canShoot = this.player.stats.rateOfFire;
     }
    //  hexagon
    if(this.bullets){
       this.drawBullets();
    }
   
    if(this.player){
      this.drawPlayer();
    }
    if(this.obstacles){
      this.drawObstacle();
    }
    this.checkCollision();
  }

  checkCollision(){
    //Check collision of obstacles and walls and each other.
    if(this.obstacles.length){
      for(let i = 0; i < this.obstacles.length; i++){
        //First check character collision... game over man!
        //Going to hack around triangle and square collissions
        //Treating the rest of the polgygons like circles since it'll be visually difficult
        //to tell the difference.
        if(this.canCollide){
          if(this.player.stats.sides < 5){
            //loop through the sides, grab the end points and the midpoint.
            for(let y = 1; y <= this.player.stats.sides; y++){
              let x1 = this.player.stats.Xcenter + this.player.stats.size * Math.cos((y-1) * 2 * Math.PI / this.player.stats.sides); 
              let y1 = this.player.stats.Ycenter + this.player.stats.size * Math.sin((y-1) * 2 * Math.PI / this.player.stats.sides);
              let x2 = this.player.stats.Xcenter + this.player.stats.size * Math.cos(y * 2 * Math.PI / this.player.stats.sides); 
              let y2 = this.player.stats.Ycenter + this.player.stats.size * Math.sin(y * 2 * Math.PI / this.player.stats.sides);
              let x3 = (x1 + x2) / 2;
              let y3 = (y1 + y2) / 2;
              if(this.obstacles[i].r > Math.abs(this.obstacles[i].x - x1) && this.obstacles[i].r > Math.abs(this.obstacles[i].y - y1)){
                this.endGame();
                break;
              }
              if(this.obstacles[i].r > Math.abs(this.obstacles[i].x - x2) && this.obstacles[i].r > Math.abs(this.obstacles[i].y - y2)){
                this.endGame();
                break;
              }
              if(this.obstacles[i].r > Math.abs(this.obstacles[i].x - x3) && this.obstacles[i].r > Math.abs(this.obstacles[i].y - y3)){
                this.endGame();
                break;
              }

            }
          } //end collision check for triangle and square
          //now check all other sizes of player and treat as circle
          else{
            let xGap = Math.abs(this.obstacles[i].x - this.player.stats.Xcenter);
            let yGap = Math.abs(this.obstacles[i].y - this.player.stats.Ycenter);
            let gap = this.obstacles[i].r + this.player.stats.size;
            if(xGap < gap && yGap < gap){
              this.endGame();
            }
          }
        }
        //Second check wall collissions.
        if(this.obstacles[i].x - this.obstacles[i].r < 0){
          this.obstacles[i].direction = Math.PI - this.obstacles[i].direction;
          this.obstacles[i].x = this.obstacles[i].r + 1;
        }
        if(this.obstacles[i].x + this.obstacles[i].r > 800){
          this.obstacles[i].direction = Math.PI - this.obstacles[i].direction;
          this.obstacles[i].x = 800 - this.obstacles[i].r - 1;
        }
        if(this.obstacles[i].y - this.obstacles[i].r < 0){
          this.obstacles[i].direction = 3 * Math.PI / 2 - (this.obstacles[i].direction + Math.PI - 3 * Math.PI / 2)
          this.obstacles[i].y = this.obstacles[i].r + 1;
        }
        if(this.obstacles[i].y + this.obstacles[i].r > 600){
          this.obstacles[i].direction = 3 * Math.PI / 2 - (this.obstacles[i].direction + Math.PI - 3 * Math.PI / 2)
          this.obstacles[i].y = 600 - this.obstacles[i].r - 1;
        }
        //Then loop through obstacles again to check obstacle to obstacle collission
        for(let y = 0; y < this.obstacles.length; y++){
          //this if check handles colliding with itself.
          if(y == i){
            continue;
          }
          let gap = this.obstacles[i].r + this.obstacles[y].r;
          let xGap = Math.abs(this.obstacles[i].x - this.obstacles[y].x);
          let yGap = Math.abs(this.obstacles[i].y - this.obstacles[y].y);
          if(gap > xGap && gap > yGap){
            let temp = this.obstacles[i].direction;
            this.obstacles[i].direction = this.obstacles[y].direction;
            this.obstacles[y].direction = temp;
            this.obstacles[i].x += Math.cos(this.obstacles[i].direction) * 2;
            this.obstacles[i].y += Math.sin(this.obstacles[i].direction) * 2;
            this.obstacles[y].x += Math.cos(this.obstacles[y].direction) * 2;
            this.obstacles[y].y += Math.sin(this.obstacles[y].direction) * 2;
          }
        }
      }
    }

    //Check Collissions of projectiles and obstacles
    if(this.canCollide){
      if(this.obstacles && this.bullets){
        for(let i = 0; i < this.obstacles.length; i++){
          for(let y = 0; y < this.bullets.length; y++){
            let angle = 2 * Math.PI / this.bullets[y].sides
            let x1 = this.bullets[y].x + this.bullets[y].size * Math.cos((this.bullets[y].direction-1) * angle);
            let y1 = this.bullets[y].y + this.bullets[y].size * Math.sin((this.bullets[y].direction-1) * angle);
            let x2 = this.bullets[y].x + this.bullets[y].size * Math.cos(this.bullets[y].direction * angle);
            let y2 = this.bullets[y].y + this.bullets[y].size * Math.sin(this.bullets[y].direction * angle);
            let midX = (x1 + x2) / 2;
            let midY = (y1 + y2) / 2;
            if(Math.abs(this.obstacles[i].x - x1) < this.obstacles[i].r && Math.abs(this.obstacles[i].y - y1) < this.obstacles[i].r || Math.abs(this.obstacles[i].x - x2) < this.obstacles[i].r && Math.abs(this.obstacles[i].y - y2) < this.obstacles[i].r || Math.abs(this.obstacles[i].x - midX) < this.obstacles[i].r && Math.abs(this.obstacles[i].y - midY) < this.obstacles[i].r){
              this.bullets.splice(y, 1);
              y--;
              this.obstacles.splice(i, 1);
              i--;
              break;
            }
          }
        }
      }
    }
  }

  createObstacles(num){
    this.obstacles = [];
    for(let i = num; i > 0; i--){
      this.obstacles.push({
        x:Math.floor(Math.random()*790),
        y:Math.floor(Math.random()*590),
        r:Math.floor(Math.random()* 20 + 10),
        direction: Math.random() * Math.PI * 2,
        speed: 2
      })
    } 
  } //end createObstacles

  drawObstacle(){
    for(let obstacle of this.obstacles){
      obstacle.x += Math.cos(obstacle.direction) * obstacle.speed;
      obstacle.y += Math.sin(obstacle.direction) * obstacle.speed;
      this.ctx.beginPath();
      this.ctx.arc(obstacle.x, obstacle.y, obstacle.r, 0, 2 * Math.PI);
      this.ctx.fillStyle = "black";
      this.ctx.fill();
    }
    if(this.obstacles.length < 1){
      //Implementing newRound() 
      this.newRound();
      //this.createObstacles(this.round++);
    }
  } //end drawObstacle

  drawPlayer(){
    if(this.movement.right){
      this.player.stats.Xcenter += 5;
    }
    if(this.movement.left){
      this.player.stats.Xcenter -= 5;
    }
    if(this.movement.up){
      this.player.stats.Ycenter -= 5;
    }
    if(this.movement.down){
      this.player.stats.Ycenter += 5;
    }
    if(this.movement.shoot){
      this.shoot();
    }

    //Checks to keep player within the canvas
    if((this.player.stats.Xcenter + (this.player.stats.size / 2)) > 800){
      this.player.stats.Xcenter = (800 - (this.player.stats.size / 2)); 
    }
    if(this.player.stats.Xcenter - (this.player.stats.size / 2) < 0){
      this.player.stats.Xcenter = 0 + (this.player.stats.size / 2);
    }
    if((this.player.stats.Ycenter + (this.player.stats.size / 2)) > 600){
      this.player.stats.Ycenter = (600 - (this.player.stats.size / 2)); 
    }
    if(this.player.stats.Ycenter - (this.player.stats.size / 2) < 0){
      this.player.stats.Ycenter = 0 + (this.player.stats.size / 2);
    }

    for (var i = 1; i <= this.player.stats.sides;i += 1) {
      this.ctx.beginPath();
      let x1 = this.player.stats.Xcenter + this.player.stats.size * Math.cos((i-1) * 2 * Math.PI / this.player.stats.sides);
      let y1 = this.player.stats.Ycenter + this.player.stats.size * Math.sin((i-1) * 2 * Math.PI / this.player.stats.sides);
      let x2 = this.player.stats.Xcenter + this.player.stats.size * Math.cos(i * 2 * Math.PI / this.player.stats.sides);
      let y2 = this.player.stats.Ycenter + this.player.stats.size * Math.sin(i * 2 * Math.PI / this.player.stats.sides);
      let x3 = (x1 + x2) / 2;
      let y3 = (y1 + y2) / 2;
      this.ctx.moveTo(this.player.stats.Xcenter, this.player.stats.Ycenter);
      this.ctx.lineTo (x1, y1);
      this.ctx.lineTo (x2, y2);
      this.ctx.lineTo(this.player.stats.Xcenter, this.player.stats.Ycenter);
      //The purpose of this if statement is to draw a gradient that will visually represent the cooldown of the rateOfFire
      if(this.player.stats.armed[i-1]){
        let grd = this.ctx.createLinearGradient(this.player.stats.Xcenter, this.player.stats.Ycenter, x3, y3);
        grd.addColorStop(this.canShoot / this.player.stats.rateOfFire,this.player.stats.color);
        grd.addColorStop(1, "white")
        this.ctx.fillStyle = grd;
        this.ctx.fill();
      }
      this.ctx.strokeStyle = this.player.stats.color;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

  } //end drawPlayer

  drawBullets(){
    for(let i = 0; i < this.bullets.length; i++){
      let force = this.player.stats.speedOfProjectile;
      let angle = 2 * Math.PI / this.bullets[i].sides
      //this needs to get cleaned up once all the calculations are moved to shoot() so they only need to be done once instead of every frame.
      this.bullets[i].x += this.bullets[i].deltaX * force;
      this.bullets[i].y += this.bullets[i].deltaY * force;
      this.ctx.beginPath();
      this.ctx.moveTo(this.bullets[i].x + this.bullets[i].size * Math.cos((this.bullets[i].direction-1) * angle), this.bullets[i].y + this.bullets[i].size * Math.sin((this.bullets[i].direction-1) * angle))
      this.ctx.lineTo(this.bullets[i].x + this.bullets[i].size * Math.cos((this.bullets[i].direction) * angle), this.bullets[i].y + this.bullets[i].size * Math.sin((this.bullets[i].direction) * angle))
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = this.player.stats.color;
      this.ctx.stroke();
      if(this.bullets[i].x > 800 || this.bullets[i].x < 0 || this.bullets[i].y > 600 || this.bullets[i].y < 0){
        this.bullets.splice(i,1);
        i--;
      }
    }
  } //end drawBullets

  shoot(){
    let angle = 2 * Math.PI / this.player.stats.sides;
    //changing canShoot from a boolean to a counter type variable to use with gradient fill...
    if(this.canShoot >= this.player.stats.rateOfFire){
      if(!this.bullets){
        this.bullets = []
      }
      for(let i = 1; i <= this.player.stats.sides;i++){
        if(!this.player.stats.armed[i-1]){
          continue;
        }
          let x1 = this.player.stats.Xcenter + this.player.stats.size * Math.cos((i-1) * angle);
          let y1 = this.player.stats.Ycenter + this.player.stats.size * Math.sin((i-1) * angle);
          let x2 = this.player.stats.Xcenter + this.player.stats.size * Math.cos(i * angle);
          let y2 = this.player.stats.Ycenter + this.player.stats.size * Math.sin(i * angle);
          let midX = ( x1 + x2 ) / 2;
          let midY = ( y1 + y2 ) / 2;
          let vDirection = Math.atan2(midY - this.player.stats.Ycenter, midX - this.player.stats.Xcenter);
          let deltaX = Math.cos(vDirection);
          let deltaY = Math.sin(vDirection);
          let lineLength = Math.hypot(Math.abs(x1 - x2), Math.abs(y1-y2));
          this.bullets.push({x:this.player.stats.Xcenter, y: this.player.stats.Ycenter, sides: this.player.stats.sides, size:this.player.stats.size, direction:i, originX: this.player.stats.Xcenter, originY: this.player.stats.Ycenter, deltaX:deltaX, deltaY:deltaY, lineLength:lineLength});
        
      }
      this.canShoot = 0;
    }
  
  } //end Shoot

  newRound(){
    this.createObstacles(this.round++);
    this.canCollide = false;
    let timeLeft = 3000;
    clearInterval(this.roundInterval);
    this.roundInterval = setInterval(()=>{
      this.ctx2.clearRect(0, 0, 800, 600);
      this.canShoot = 0;
      this.ctx2.font = "30px Comic Sans MS";
      this.ctx2.fillStyle = "blue";
      this.ctx2.textAlign = "center";
      this.ctx2.fillText("Round " + (this.round - 1) +  " starting in... " + Math.ceil(timeLeft / 1000), this.canvas.width/2, this.canvas.height/2)
      timeLeft -= 15;
    }, 15);
    setTimeout(()=>{
      this.ctx2.clearRect(0, 0, 800, 600);
      clearInterval(this.roundInterval);
      this.canCollide = true;
    }, 3000);
  }

  endGame(){
    let timeLeft = 2000;
    clearInterval(this.drawInterval);
    this.roundInterval = setInterval(()=>{
      this.canShoot = 0;
      this.ctx2.font = "30px Comic Sans MS";
      this.ctx2.fillStyle = "blue";
      this.ctx2.textAlign = "center";
      this.ctx2.fillText("Game ended on round" + (this.round - 1), this.canvas.width/2, this.canvas.height/2)
      timeLeft -= 5;
    }, 15);
    setTimeout(()=>{
      clearInterval(this.roundInterval);
      this.ctx2.clearRect(0, 0, 800, 600);
      this.gameOver = true;
    }, 2000);
  }

  pauseGame(){
    if(this.gamePaused){
      this.gamePaused = false;
      this.drawInterval = setInterval(()=>{
        this.draw();
      }, 15);
    }
    else{
      clearInterval(this.drawInterval);
      this.gamePaused = true;
      this.ctx.font = "30px Comic Sans MS";
      this.ctx.fillStyle = "purple";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Game Paused", this.canvas.width/2, this.canvas.height/2)
    }
  }
}
