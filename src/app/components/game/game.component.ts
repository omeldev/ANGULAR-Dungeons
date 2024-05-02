import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Player} from "../../classes/entitiy/player/player";
import {isKeyPressed, registerKeystrokes, setKeyPressed} from "../../listener/keystroke";
import {level1, level2, level3, level4} from "../../levels/levels";
import {Level} from "../../classes/level/level";
import {Position} from "../../classes/entitiy/position";
import {Flashlight} from "../../classes/shaders/flashlight";
import {TitleScreen} from "../../classes/gui/window/title";
import {Button} from "../../classes/gui/button/button";
import {GameAudio, initializeSounds} from "../../classes/audio/audio";
import {Mobile} from "../../classes/gui/window/mobile";
import {Scale} from "../../classes/entitiy/scale";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {

  public static isMobile = window.innerWidth < 800 || window.innerHeight < 600;
  public static canvasWidth = 64 * 16;
  public static canvasHeight = 64 * 9;
  public static productionMode: boolean = true;
  public static player: Player;
  public static volume: number = 1.0;
  public static isTitleScreen: boolean = true;
  public static hasInteracted: boolean = false;
  private static currentLevel = level1;
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('cameraCanvas', { static: true })
  public cameraCanvas: ElementRef<HTMLCanvasElement> | undefined;
  public cameraContext: CanvasRenderingContext2D | undefined;
  public context: CanvasRenderingContext2D | undefined;


  public flashLightShader = new Flashlight();
  public static isFlashLightShaderOn: boolean = true;
  public volume: number = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')!) : 1.0;
  public escapeCooldown = 0;
  private oldFrameTime: number = 1;


  constructor() {
    GameComponent.player = new Player();
    initializeSounds();
    this.registerGuiListener();
  }

   public registerGuiListener() {
    window.addEventListener("click", (event) => {
      const pos = GameComponent.translateTouchToCanvasPosition(event.clientX, event.clientY, this.cameraCanvas!.nativeElement);
      if(GameComponent.isTitleScreen){
        TitleScreen.checkButtons(pos.x, pos.y);
      }

      if(GameComponent.isMobile){
        Mobile.checkButtons(pos.x, pos.y);
      }


    });

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

  public static levelChange(): void {
    const levels = [level1, level2, level3, level4];
    const index = levels.indexOf(GameComponent.getCurrentLevel());
    GameComponent.setCurrentLevel(levels[(index + 1) % levels.length]);


  }

  public titleUpdate(delta: number): void {
    if (this.escapeCooldown > 0) {
      this.escapeCooldown -= delta;
    } else {
      this.escapeCooldown = 0;
    }

    if (isKeyPressed('Escape') && this.escapeCooldown <= 0) {
      if(GameComponent.isTitleScreen){
        GameComponent.player.preventInput = false;
      }
      GameComponent.isTitleScreen = !GameComponent.isTitleScreen;
      this.escapeCooldown = 1.5;

      setKeyPressed('Escape', false)
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



    localStorage.setItem('volume', this.volume.toString());

    GameComponent.volume = parseFloat(localStorage.getItem('volume') || '1.0');





    this.changeCanvasSize(GameComponent.getCurrentLevel().getBackground().getWidth(), GameComponent.getCurrentLevel().getBackground().getHeight());


    GameComponent.getCurrentLevel().drawSprite(this.context!);


    if (!GameComponent.productionMode) {
      GameComponent.getCurrentLevel().drawCollisionBlocks(this.context!);

    }



    const delta = (performance.now() - this.oldFrameTime) / 1000;

    GameComponent.getCurrentLevel().getFinalDoor().drawSprite(this.context!, delta);
    GameComponent.player.update(this.context!, delta);

    this.oldFrameTime = performance.now();
    GameComponent.getCurrentLevel().getCoins().forEach(coin => coin.drawSprite(this.context!, delta));
    GameComponent.getCurrentLevel().getKey().forEach(key => key.drawSprite(this.context!, delta));
    GameComponent.getCurrentLevel().getShines().forEach(shine => shine.drawSprite(this.context!, delta));
    GameComponent.getCurrentLevel().getWizzards().forEach(wizzard => {
      wizzard.update(this.context!, delta)
      wizzard.drawSprite(this.context!, delta)
    });

    GameComponent.getCurrentLevel().getPigs().forEach(pig => {
      pig.update(this.context!, delta)
      pig.drawSprite(this.context!, delta)
    });

    GameComponent.getCurrentLevel().getBats().forEach(bat => {
      bat.update(this.context!, delta)
      bat.drawSprite(this.context!, delta)
    });


    GameComponent.getCurrentLevel().getHealthPotions().forEach(potion => potion.drawSprite(this.context!, delta));
    GameComponent.player.drawSprite(this.context!, delta);


    this.titleUpdate(delta)

    if (GameComponent.getCurrentLevel().getFinalDoor().checkCollision(GameComponent.player) && isKeyPressed('w') && GameComponent.player.collectedKeys >= 1 ) {
      if(GameComponent.player.isAttacking) return;
      GameComponent.getCurrentLevel().getFinalDoor().play();
      GameAudio.getAudio('door:open').play();
      GameComponent.player.collectedKeys -= 1;
      GameComponent.player.getVelocity().setY(0);
      GameComponent.player.getVelocity().setX(0);
      GameComponent.player.preventInput = true;
      GameComponent.player.switchSprite('enterDoor');



    }


    if(GameComponent.isFlashLightShaderOn) this.flashLightShader.draw(this.context!, delta);
    if (isKeyPressed('f') && !(this.flashLightShader.cooldown > 0) && GameComponent.player.collectedShines < 3) {
      this.flashLightShader.toggle();
    }

    this.moveCamera();


    if (GameComponent.isTitleScreen) {
      TitleScreen.getScreen().draw(this.cameraContext!);
      return;
    }

    if(GameComponent.isMobile){
      this.mobileControls.draw(this.cameraContext!);
      return;
    }








  }

  public mobileControls: Mobile = new Mobile([
    new Button('../../../assets/gui/mobile/left.png', new Position(0, 400), new Scale(0.25), () => {
      setKeyPressed('a', true);
    }, () => {
      setKeyPressed('a', false);
    }),
    new Button('../../../assets/gui/mobile/right.png', new Position(100, 400),new Scale(0.25), () => {
      setKeyPressed('d', true);
    }, () => {setKeyPressed('d', false);}),
    new Button('../../../assets/gui/mobile/up.png', new Position(50, 350),new Scale(0.25), () => {
      setKeyPressed('w', true);
    }, () => {setKeyPressed('w', false)}),
    new Button('../../../assets/gui/mobile/down.png', new Position(100, 0),new Scale(0.25), () => {

    }),
  ]);

  private moveCamera() {
    const cameraWidth = 750;
    const cameraHeight = 500;
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

  private static translateTouchToCanvasPosition(x: number, y: number, canvas: HTMLCanvasElement): {x: number, y:number} {

    const rect = canvas.getBoundingClientRect();
    const tempX = x - rect.left;
    const tempY = y - rect.top;

    return {
      x: tempX * (canvas.width / rect.width),
      y: tempY * (canvas.height / rect.height)
    };

  }

  public touchEnd(event: TouchEvent): void {

    if(GameComponent.isMobile){
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
      if(GameComponent.isMobile){
        Mobile.releaseButtons(touchEndX, touchEndY);
      }
    }


  }

  touchStart(event: TouchEvent) {

    const {clientX, clientY} = event.touches[0];
    const canvasTouch = GameComponent.translateTouchToCanvasPosition(clientX, clientY, this.cameraCanvas!.nativeElement);

    if(GameComponent.isTitleScreen){
      TitleScreen.checkButtons(canvasTouch.x, canvasTouch.y);
    }

    if(GameComponent.isMobile){
      Mobile.checkButtons(canvasTouch.x, canvasTouch.y);
    }

  }
}
