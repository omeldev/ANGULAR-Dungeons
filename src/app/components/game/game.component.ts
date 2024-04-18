import { Component } from '@angular/core';
import {Player} from "../classes/player";
import {Sprite} from "../classes/sprite";
import {Position} from "../classes/position";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private player: Player;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.player = new Player( new Position(0, 0), new Sprite('player.png'));
  }


}
