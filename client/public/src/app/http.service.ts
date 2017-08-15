import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import "rxjs";

@Injectable()
export class HttpService {

  constructor(private _http:Http) { }

 createPlayer(info){
    console.log("http.service createPlayer")
    console.log(info);
    return this._http.post("/createPlayer", info).map(data=>data.json()).toPromise();
  }

  findPlayer(){
    console.log("http.service findPlayer")
    return this._http.get("/findPlayer").map(data=>data.json()).toPromise();
  }

  checkSession(){
    console.log("http.service checkSession")
    return this._http.get("/checkSession").map(data=>data.json()).toPromise();
  }

  setSession(data){
    console.log(`http.service setSession ${data}`)
    return this._http.post("/setSession", {player:data}).map(data=>data.json()).toPromise();
  }



}


