import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Player} from "../../classes/entitiy/player/player";
import {Sprite} from "../../classes/entitiy/sprite";
import {Position} from "../../classes/entitiy/position";
import {registerKeystrokes} from "../../listener/keystroke";
import {level1, level2} from "../../levels/levels";

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
  public static productionMode: boolean = false;

  public prodMode: boolean = GameComponent.productionMode;



  constructor() {
    const spr = new Sprite('../../../assets/sprites/player/guard_1.png', new Position(100, 100));
    spr.setIsBackground(true);
    this.player = new Player(new Position(356, 250), spr);
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

  private changeCanvasSize(width: number, height: number) {
    this.canvas!.nativeElement.width = width;
    this.canvas!.nativeElement.height = height;

  }


  private animate() {
    window.requestAnimationFrame(() => this.animate());
    this.changeCanvasSize(this.player.getCurrentLevel().getBackground().getWidth(), this.player.getCurrentLevel().getBackground().getHeight());
    this.player.getCurrentLevel().draw(this.context!);
    this.player.getCurrentLevel().getFinalDoor().setPosition(this.player.getPosition())
    this.player.getCurrentLevel().getFinalDoor().draw(this.context!);

    if(!GameComponent.productionMode) {
      this.player.getCurrentLevel().drawCollisionBlocks(this.context!);

    }
    this.player.update(this.context!);

    if(this.player.getCurrentLevel().getFinalDoor().checkCollision(this.player)) {

      console.log("DOOOOOOR")
      this.player.setCurrentLevel(level2);
    }
  }

  public static toggleProductionMode(): void {
    this.productionMode = !this.productionMode;
  }



}
