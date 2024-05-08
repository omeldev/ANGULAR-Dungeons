import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Player} from "../../classes/entitiy/player/player";
import {isKeyPressed, registerKeystrokes, setKeyPressed} from "../../listener/keystroke";
import {level1, level2, level3, level4} from "../../levels/levels";
import {Level} from "../../classes/level/level";
import {FlashlightShader} from "../../classes/shaders/flashlight";
import {TitleScreen} from "../../classes/gui/window/title";
import {initializeSounds} from "../../classes/audio/audio";
import {Mobile} from "../../classes/gui/window/mobile";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {

  public static isMobile = window.innerWidth < 1000 || window.innerHeight < 800;
  public static canvasWidth = 64 * 16;
  public static canvasHeight = 64 * 9;
  public static player: Player;
  public static volume: number = 1.0;
  public static isTitleScreen: boolean = true;
  public static hasInteracted: boolean = false;
  public static isFlashLightShaderOn: boolean = true;
  private static currentLevel = level1;
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('cameraCanvas', {static: true})
  public cameraCanvas: ElementRef<HTMLCanvasElement> | undefined;
  public cameraContext: CanvasRenderingContext2D | undefined;
  public context: CanvasRenderingContext2D | undefined;
  public flashLightShader = new FlashlightShader();
  public volume: number = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')!) : 1.0;
  private oldFrameTime: number = 1;


  constructor() {
    GameComponent.player = new Player();
    initializeSounds();
    this.registerGuiListener();
  }

  public static getPlayer(): Player {
    return GameComponent.player;
  }

  public static getCurrentLevel(): Level {
    return this.currentLevel;
  }

  public static setCurrentLevel(level: Level): void {
    GameComponent.currentLevel = level;

    GameComponent.canvasHeight = GameComponent.getCurrentLevel().getBackground().getHeight();
    GameComponent.canvasWidth = GameComponent.getCurrentLevel().getBackground().getWidth();

    GameComponent.player.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());
    GameComponent.isFlashLightShaderOn = true;
    GameComponent.player.collectedShines = 0;
  }

  public static levelChange(): void {
    const levels = [level1, level4, level3, level2];
    const index = levels.indexOf(GameComponent.getCurrentLevel());
    GameComponent.setCurrentLevel(levels[(index + 1) % levels.length]);


  }

  private static translateTouchToCanvasPosition(x: number, y: number, canvas: HTMLCanvasElement): {
    x: number,
    y: number
  } {

    const rect = canvas.getBoundingClientRect();
    const tempX = x - rect.left;
    const tempY = y - rect.top;

    return {
      x: tempX * (canvas.width / rect.width),
      y: tempY * (canvas.height / rect.height)
    };

  }

  public registerGuiListener() {
    window.addEventListener("click", (event) => {
      const pos = GameComponent.translateTouchToCanvasPosition(event.clientX, event.clientY, this.cameraCanvas!.nativeElement);
      if (GameComponent.isTitleScreen) {
        TitleScreen.checkButtons(pos.x, pos.y);
      }

      if (GameComponent.isMobile) {
        Mobile.checkButtons(pos.x, pos.y);
      }


    });

  }

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event): void {
    if (document.visibilityState === 'hidden') {
    } else {
      window.location.reload();
    }
  }

  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d')!;

    // @ts-ignore
    this.cameraContext = this.cameraCanvas?.nativeElement.getContext('2d');
    this.initializeCanvas();

    GameComponent.isMobile = window.innerWidth < 800 || window.innerHeight < 600;


  }

  public touchEnd(event: TouchEvent): void {
    event.preventDefault();

    if (GameComponent.isMobile) {
      setKeyPressed('a', false);
      setKeyPressed('d', false);
      setKeyPressed('w', false);
      setKeyPressed('f', false);
      setKeyPressed('space', false);
    }


    const touches = event.changedTouches;
    if (touches.length > 0) {
      const touchEndX = touches[0].clientX;
      const touchEndY = touches[0].clientY;
      if (GameComponent.isMobile) {
        Mobile.releaseButtons(touchEndX, touchEndY);
      }
    }


  }

  touchStart(event: TouchEvent) {
    event.preventDefault();


    const {clientX, clientY} = event.touches[0];
    const canvasTouch = GameComponent.translateTouchToCanvasPosition(clientX, clientY, this.cameraCanvas!.nativeElement);

    if (GameComponent.isTitleScreen) {
      TitleScreen.checkButtons(canvasTouch.x, canvasTouch.y);
    }

    if (GameComponent.isMobile) {
      Mobile.checkButtons(canvasTouch.x, canvasTouch.y);
    }

  }

  private initializeCanvas() {
    this.canvas!.nativeElement.width = GameComponent.canvasWidth;
    this.canvas!.nativeElement.height = GameComponent.canvasHeight;

    registerKeystrokes();
    this.animate();

  }


  private changeCanvasSize(width: number, height: number) {
    this.canvas!.nativeElement.width = width;
    this.canvas!.nativeElement.height = height;
    GameComponent.canvasWidth = width;
    GameComponent.canvasHeight = height;

  }

  private animate() {
    window.requestAnimationFrame(() => this.animate());



    if (GameComponent.isTitleScreen) {
      GameComponent.player.preventInput = true;

    }




    GameComponent.volume = parseFloat(localStorage.getItem('volume') || '1.0');
    localStorage.setItem('volume', this.volume.toString());
    this.changeCanvasSize(GameComponent.getCurrentLevel().getBackground().getWidth(), GameComponent.getCurrentLevel().getBackground().getHeight());


    const delta = (performance.now() - this.oldFrameTime) / 1000;
    this.oldFrameTime = performance.now();


    GameComponent.getCurrentLevel().draw(this.context!, delta);
    GameComponent.player.update(this.context!, delta);
    GameComponent.player.drawSprite(this.context!, delta);

    //Draw Shader
    if (GameComponent.isFlashLightShaderOn) {
      if (GameComponent.getCurrentLevel().isLoaded) this.flashLightShader.draw(this.context!, delta);
    }


    if (isKeyPressed('f') && !(this.flashLightShader.cooldown > 0) && GameComponent.player.collectedShines < 3) {
      this.flashLightShader.toggle();
    }

    this.moveCamera();
    if(GameComponent.hasInteracted) {
     if(GameComponent.isMobile) {
       if(this.cameraCanvas?.nativeElement.requestFullscreen)
       this.cameraCanvas?.nativeElement.requestFullscreen().then()

     }

    }

    if (GameComponent.isTitleScreen) {
      TitleScreen.getScreen().draw(this.cameraContext!);
      return;
    }

    if (GameComponent.isMobile) {
      Mobile.getScreen().draw(this.cameraContext!);
      return;
    }


  }

  private moveCamera() {
    if (!GameComponent.getCurrentLevel().isLoaded) return;
    const cameraWidth = GameComponent.isMobile ? window.innerWidth : 800;
    const cameraHeight = GameComponent.isMobile ? window.innerHeight : 500;
    this.cameraCanvas!.nativeElement.width = cameraWidth;
    this.cameraCanvas!.nativeElement.height = cameraHeight;

    const offsetX = 150;
    const offsetY = 50;

    // Calculate the position of the camera center relative to the player's position
    let cameraCenterX = GameComponent.player.getPosition().getX() + offsetX;
    let cameraCenterY = GameComponent.player.getPosition().getY() + offsetY;

    // Ensure the camera stays within the bounds of the canvas
    cameraCenterX = Math.max(cameraWidth / 2, Math.min(GameComponent.canvasWidth - cameraWidth / 2, cameraCenterX));
    cameraCenterY = Math.max(cameraHeight / 2, Math.min(GameComponent.canvasHeight - cameraHeight / 2, cameraCenterY));

    // Calculate the top-left corner of the camera
    const cameraStartX = cameraCenterX - cameraWidth / 2;
    const cameraStartY = cameraCenterY - cameraHeight / 2;

    // Draw the portion of the game canvas onto the camera canvas
    this.cameraContext!.drawImage(
      this.canvas!.nativeElement,
      cameraStartX, cameraStartY, cameraWidth, cameraHeight,
      0, 0, cameraWidth, cameraHeight
    );
  }
}
