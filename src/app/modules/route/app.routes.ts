import {Routes} from '@angular/router';
import {GameComponent} from "../../components/game/game.component";
import {IntroComponent} from "../../components/intro/intro.component";

export const routes: Routes = [
  {path: '', component: IntroComponent},
  {path: 'game', component: GameComponent}
];
