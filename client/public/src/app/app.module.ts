import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { ArenaComponent } from './arena/arena.component';
import { StandingsComponent } from './arena/standings/standings.component';
import { CharacterComponent } from './arena/character/character.component';
import { BattleComponent } from './arena/battle/battle.component';
import { HttpService } from "./http.service";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ArenaComponent,
    StandingsComponent,
    CharacterComponent,
    BattleComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
