import {Routes} from '@angular/router';
import {ErrorComponent} from "../../components/error/error.component";
import {GameComponent} from "../../components/game/game.component";

export const routes: Routes = [
  {path: '**', component: GameComponent}
];
