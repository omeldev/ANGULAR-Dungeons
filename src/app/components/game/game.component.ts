import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Player} from "../../classes/entitiy/player/player";
import {isKeyPressed, registerKeystrokes, setKeyPressed} from "../../listener/keystroke";
import {level1, level2, level3, level4} from "../../levels/levels";
import {Level} from "../../classes/level/level";
import {BehaviorSubject} from "rxjs";
import {Gizmo} from "../../classes/entitiy/gizmo/gizmo";
import {Animation, AnimationSet} from "../../classes/animation";
import {KingPig, Pig} from "../../classes/entitiy/gizmo/pig";
import {Position} from "../../classes/entitiy/position";
import {Flashlight} from "../../classes/shaders/flashlight";
import {Cat} from "../../classes/entitiy/gizmo/cat";
import {Bat} from "../../classes/entitiy/gizmo/bat";
import {TitleScreen} from "../../classes/gui/window/title";
import {Button} from "../../classes/gui/button/button";
import {registerGuiListener} from "../../../assets/gui/listener/mouseclick";
import {GameAudio, initializeSounds} from "../../classes/audio/audio";
import {Princess} from "../../classes/entitiy/gizmo/princess";
import {Wizard} from "../../classes/entitiy/boss/wizard";
import {Healthbar} from "../../classes/gui/bar/healthbar";
import {isArray} from "@angular/compiler-cli/src/ngtsc/annotations/common";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {

  public static isMobile: boolean = false;
  public static canvasWidth = 64 * 16;
  public static canvasHeight = 64 * 9;
  public static productionMode: boolean = true;
  public static player: Player;
  public static volume: number = 1.0;
  public static isPaused: boolean = true;
  public static isMuted: boolean = false;
  public static hasInteracted: boolean = false;
  private static currentLevel = level1;
  private static readonly coinSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public static coins$ = GameComponent.coinSubject$.asObservable();
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('cameraCanvas', { static: true })
  public cameraCanvas: ElementRef<HTMLCanvasElement> | undefined;
  public cameraContext: CanvasRenderingContext2D | undefined;
  public context: CanvasRenderingContext2D | undefined;
  public prodMode: boolean = GameComponent.productionMode;
  public coins$ = GameComponent.coins$;
  public titleScreen: TitleScreen = new TitleScreen([
    new Button('../../../assets/gui/buttons/play.png', new Position(100, 100), () => {
      GameComponent.isPaused = false;
      GameComponent.player.preventInput = false;
    }),
  ]);

  public isFullscreen: boolean = true;

  public flashLight = new Flashlight();
  public static isFlashlightOn: boolean = true;
  public princess: Princess = new Princess(new Position(64 * 2 + 20, 64 * 4 + 36));
  public volume: number = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')!) : 1.0;
  public escapeCooldown = 0;
  private oldFrameTime: number = 1;
  private cat: Cat = new Cat(new Position(64 * 2 + 20, 64 * 4 + 36));
  public static flashCount = 0;
  public static flashBuffer = 0.005;
  public static flashIterations = 0;

  constructor() {
    GameComponent.player = new Player();
    initializeSounds();
    registerGuiListener();
  }

  public static getPlayer(): Player {
    return GameComponent.player;
  }

  public static getCurrentLevel(): Level {
    return this.currentLevel;
  }

  public static nextCoin(coin: number): void {
    GameComponent.coinSubject$.next(coin);
  }

  public static setCurrentLevel(level: Level): void {
    GameComponent.currentLevel = level;
  }

  public static toggleProductionMode(): void {
    this.productionMode = !this.productionMode;
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

    GameComponent.canvasHeight = GameComponent.getCurrentLevel().getBackground().getHeight();
    GameComponent.canvasWidth = GameComponent.getCurrentLevel().getBackground().getWidth();

    GameComponent.player.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());

    GameComponent.isFlashlightOn = true;
    GameComponent.player.collectedShines = 0;
    GameComponent.flashCount = 0;
    GameComponent.flashIterations = 0;


  }

  public titleUpdate(delta: number): void {
    if (this.escapeCooldown < 1.5) {
      this.escapeCooldown += delta;
    } else {
      this.escapeCooldown = 0;
    }

    if (isKeyPressed('Escape') && this.escapeCooldown <= 0) {
      GameComponent.isPaused = !GameComponent.isPaused;
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

  private healthbar: Healthbar = new Healthbar(new Position(0, 200));
  private animate() {
    window.requestAnimationFrame(() => this.animate());

    if (GameComponent.isPaused) {
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



    if (GameComponent.getCurrentLevel() === level1) {
      this.cat.drawSprite(this.context!, delta);
      this.princess.drawSprite(this.context!, delta);
    }
    this.healthbar.position.setX(GameComponent.player.getPosition().getX() + 30);
    this.healthbar.position.setY(GameComponent.player.getPosition().getY() + 10);

    this.healthbar.draw(this.context!, 10, GameComponent.player.health, GameComponent.player.maxHealth);


    if (GameComponent.player.collectedShines >= 3) {
      this.flashLight.isActive = true;
      if (GameComponent.flashIterations < 50) {

        this.flashLight.draw(this.context!, GameComponent.player.getPosition(), delta, 250 + (GameComponent.player.collectedShines + 1 + GameComponent.flashIterations) * 5);
        if (GameComponent.flashCount < GameComponent.flashBuffer) {
          GameComponent.flashCount += delta;

        } else {
          GameComponent.flashCount = 0;
          GameComponent.flashIterations++;
          if (GameComponent.flashIterations >= 50) {
            GameComponent.flashIterations = 0;
            GameComponent.flashCount = 0;
            GameComponent.isFlashlightOn = false;
            GameComponent.player.collectedShines = 0;

          }
        }
      }
    } else if (GameComponent.isFlashlightOn) this.flashLight.draw(this.context!, GameComponent.player.getPosition(), delta, (GameComponent.player.collectedShines + 1) * 40);


    this.moveCamera();

    if (GameComponent.isPaused) {
      this.titleScreen.draw(this.cameraContext!);
      return;
    }

    if (isKeyPressed('f') && !(this.flashLight.cooldown > 0) && GameComponent.player.collectedShines < 3) {
      this.flashLight.toggle();
    }


  }

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
}
