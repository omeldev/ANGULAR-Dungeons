import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {animate} from "@angular/animations";
import {Player} from "../classes/player";
import {Sprite} from "../classes/sprite";
import {Position} from "../classes/position";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  public context: CanvasRenderingContext2D | undefined;
  public static canvasWidth = 64 * 16;
  public static canvasHeight = 64 * 9;

  private player: Player;


  constructor() {
    this.player = new Player(new Position(100, 100), new Sprite('assets/player.png'));

  }

  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d')!;
    this.iniCanvas();
  }

  private iniCanvas() {
    this.canvas!.nativeElement.width = GameComponent.canvasWidth;
    this.canvas!.nativeElement.height = GameComponent.canvasHeight;



    this.animate();
  }

  private animate() {
    window.requestAnimationFrame(() => this.animate());
    this.context!.fillStyle = 'white';
    this.context!.fillRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);

    this.player.update(this.context!);

  }


}
