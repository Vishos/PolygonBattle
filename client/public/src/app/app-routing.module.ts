import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from "./landing/landing.component";
import { ArenaComponent } from "./arena/arena.component";
import { BattleComponent } from "./arena/battle/battle.component";
import { CharacterComponent } from "./arena/character/character.component";
import { StandingsComponent } from "./arena/standings/standings.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: "/landing"
  },
  {
    path:"landing",
    component: LandingComponent
  },
  {
    path:"arena",
    component:ArenaComponent,
    children:[
      {
        path:"battle",
        component:BattleComponent
      },
      {
        path:"character",
        component:CharacterComponent
      },
      {
        path:"standings",
        component:StandingsComponent
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
