import {Routes} from '@angular/router';
import {ErrorComponent} from "../../components/error/error.component";

export const routes: Routes = [
  {path: '**', component: ErrorComponent}
];
