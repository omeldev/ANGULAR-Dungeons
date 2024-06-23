import {Component, signal} from '@angular/core';
import {LeaderboardService} from "../../services/leaderboard.service";
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


  constructor(public readonly leaderboardService: LeaderboardService,
              public readonly router: Router) {


  }

  public redirect(): void {
    this.router.navigate(['/game']).then(r => console.log(r));
  }


}
