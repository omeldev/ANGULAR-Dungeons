import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Player} from "../../classes/player";
import {Sprite} from "../../classes/sprite";
import {Position} from "../../classes/position";
import {registerKeystrokes} from "../../listener/keystroke";
import {Animation} from "../../classes/animation";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {
  public static canvasWidth = 64 * 16;
  public static canvasHeight = 64 * 9;
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  public context: CanvasRenderingContext2D | undefined;
  private player: Player;


  constructor() {
    const spr = new Sprite('../../../assets/sprites/player/guard_1.png', new Position(100, 100));
    spr.setIsBackground(true);
    this.player = new Player(new Position(100, 100), spr);

  }

  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d')!;
    this.iniCanvas();
  }

  private iniCanvas() {
    this.canvas!.nativeElement.width = GameComponent.canvasWidth;
    this.canvas!.nativeElement.height = GameComponent.canvasHeight;

    registerKeystrokes();
    this.animate();
  }


  private animate() {
    window.requestAnimationFrame(() => this.animate());
    this.context!.fillStyle = 'white';
    this.context!.fillRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);

    this.player.update(this.context!);


  }


}
