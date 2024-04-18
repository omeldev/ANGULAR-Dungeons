import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorComponent} from "./components/error/error.component";

import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {routes} from "./modules/route/app.routes";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { GameComponent } from './components/game/game.component';


@NgModule({
  declarations: [
    AppComponent,

    ErrorComponent,
      GameComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
