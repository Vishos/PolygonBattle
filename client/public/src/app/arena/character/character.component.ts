import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArenaCharacter } from "../../arena-character";
import { HttpService } from "../../http.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {

  avatar;
  interval;
  canvas;
  ctx;
  formComplete;

  constructor(private _httpService: HttpService, private router:Router) {
    this.avatar = new ArenaCharacter();
    this.avatar.stats = {
        sides:5,
        size:20,
        rateOfFire: 4000,
        speedOfProjectile: 2.5,
        color:"#ff0000"
    }

    if(document.readyState == "complete"){
      console.log("document is already loaded");
      if(!this.canvas){
        this.interval = setInterval(()=>{
          console.log("number of cycles before it acquires canvas")
          this.canvas = document.getElementById("canvas");
          if(this.canvas){
            this.ctx = this.canvas.getContext('2d'); 
            this.canvas.width = 200;
            this.canvas.height = 200;
            clearInterval(this.interval);
            this.interval = setInterval(()=>{
              // if(this.formComplete){
              //   clearInterval(interval);
              // }
              this.draw(this.ctx)}, 20);
          }
        }, 30);
      }
    
    }
    else{
      document.addEventListener("DOMContentLoaded", (event) => { 
        //do work
        console.log("document loaded");
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d'); 
        this.canvas.width = 200;
        this.canvas.height = 200;
        this.interval = setInterval(()=>{this.draw(this.ctx)}, 20);
      });
    }  
   } //end constructor

  ngOnInit() {}

  processForm(){
    this.formComplete = true;
    this._httpService.setSession(this.avatar).then(result =>{
      console.log("character.component processForm .then");
      console.log(result);
      this.router.navigate(["/arena/battle"])
    }).catch(err =>{
      console.log("character.component processForm .catch");
      console.log(err);
    })

  }

  draw(ctx){
    //  hexagon
    ctx.clearRect(0, 0, 200, 200);
    var size = 50;
    var Xcenter = 100;
    var Ycenter = 100;

    ctx.beginPath();
    ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

    for (var i = 1; i <= this.avatar.stats.sides;i += 1) {
      ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / this.avatar.stats.sides), Ycenter + size * Math.sin(i * 2 * Math.PI / this.avatar.stats.sides));
    }

    ctx.fillStyle = this.avatar.stats.color;
    ctx.fill();

  }
  
  ngOnDestroy(){
    clearInterval(this.interval);
  }


}

