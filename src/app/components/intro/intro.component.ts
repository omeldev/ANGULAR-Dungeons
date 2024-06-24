import {Component, signal} from '@angular/core';
import {GameService} from "../../services/game.service";
import {Router} from "@angular/router";
import {distinctUntilChanged} from "rxjs";
import {FormControl} from "@angular/forms";
import {GameComponent} from "../game/game.component";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {

  public name: FormControl<string | null> = new FormControl('');


  constructor(public readonly gameService: GameService,
              public readonly router: Router) {



  }

  public redirect(): void {
    localStorage.setItem('name', this.gameService.name);
    localStorage.setItem('volume', this.gameService.volume.toString());
    this.router.navigate(['/game']).then(r => console.log(r));
  }


}
