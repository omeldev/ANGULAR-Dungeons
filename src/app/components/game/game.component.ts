import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Player} from "../../classes/entitiy/player/player";
import {isKeyPressed, registerKeystrokes} from "../../listener/keystroke";
import {level1, level2, level3} from "../../levels/levels";
import {Level} from "../../classes/level/level";
import {BehaviorSubject} from "rxjs";
import {Gizmo} from "../../classes/entitiy/gizmo/gizmo";
import {Animation, AnimationSet} from "../../classes/animation";
import {KingPig, Pig} from "../../classes/entitiy/gizmo/pig";
import {Sprite} from "../../classes/entitiy/sprite";
import {Position} from "../../classes/entitiy/position";
import {Flashlight} from "../../classes/entitiy/shaders/flashlight";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit {

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event): void {
    if (document.visibilityState === 'hidden') {
    } else {
      window.location.reload();
    }
  }

  public static canvasWidth = 64 * 16;
  public static canvasHeight = 64 * 9;
  public static productionMode: boolean = true;
  private static currentLevel = level1;
  private static readonly coinSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public static coins$ = GameComponent.coinSubject$.asObservable();
  @ViewChild('canvas', {static: true})
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  public context: CanvasRenderingContext2D | undefined;
  public prodMode: boolean = GameComponent.productionMode;
  public coins$ = GameComponent.coins$;
  public static player: Player;
  private oldFrameTime: number = 1;
  public static volume: number = 1.0;

  public static hasInteracted: boolean = false;
  public gizmo: Gizmo[];

  public flashLight = new Flashlight();


  public isFlashlightOn: boolean = true;

  public switchFlashlight(): void {
    this.isFlashlightOn = !this.isFlashlightOn;
  }

  public static getPlayer(): Player {
    return GameComponent.player;
  }

  public gizmoAnimations = new AnimationSet([
    new Animation('idle', '../../../assets/sprites/pig/animation/idle.png', 11, 4, true, true, () => {
    }),
    new Animation('runLeft', '../../../assets/sprites/pig/animation/runLeft.png', 6, 4, true, true, () => {
    }),
    new Animation('runRight', '../../../assets/sprites/pig/animation/runRight.png', 6, 4, true, true, () => {
    })
  ]);

  constructor() {
    GameComponent.player = new Player('../../../assets/sprites/player/animation/idle.png',
      {
        idleRight: {
          frameRate: 11,
          frameBuffer: 4,
          loop: true,
          imageSrc: '../../../assets/sprites/player/animation/idle.png'
        },
        idleLeft: {
          frameRate: 11,
          frameBuffer: 4,
          loop: true,
          imageSrc: '../../../assets/sprites/player/animation/idleLeft.png'

        },
        runRight: {
          frameRate: 8,
          frameBuffer: 4,
          loop: true,
          imageSrc: '../../../assets/sprites/player/animation/runRight.png'

        },
        runLeft: {
          frameRate: 8,
          frameBuffer: 4,
          loop: true,
          imageSrc: '../../../assets/sprites/player/animation/runLeft.png'

        },
        enterDoor: {
          frameRate: 8,
          frameBuffer: 12,
          loop: false,
          imageSrc: '../../../assets/sprites/player/animation/enterDoor.png',
          onComplete: () => {
            this.levelChange();
            GameComponent.player.preventInput = false;
            for (let i = 0; i < this.gizmo.length; i++) {
              this.gizmo[i].setPosition(GameComponent.getCurrentLevel().getSpawnPoint());

            }
          }
        },
        leaveDoor: {
          frameRate: 8,
          frameBuffer: 12,
          loop: false,
          imageSrc: '../../../assets/sprites/player/animation/leaveDoor.png',
          onComplete: () => {
            GameComponent.player.preventInput = false;
          }
        },
        attack: {
          frameRate: 3,
          frameBuffer: 111,
          loop: false,
          imageSrc: '../../../assets/sprites/player/animation/attack.png',
          onComplete: () => {
            GameComponent.player.isAttacking = false;
            console.log("Attack done")
          }
        }

      });

    this.gizmo = [];

    for (let i = 0; i < 5; i++) {
      this.gizmo.push(new Pig())
      if(i == 2){
        this.gizmo.push(new KingPig())
      }
    }
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


  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d')!;
    this.initializeCanvas();


  }


  public levelChange(): void {
    const levels = [level1, level2, level3];
    const index = levels.indexOf(GameComponent.getCurrentLevel());
    GameComponent.setCurrentLevel(levels[(index + 1) % levels.length]);

    GameComponent.canvasHeight = GameComponent.getCurrentLevel().getBackground().getHeight();
    GameComponent.canvasWidth = GameComponent.getCurrentLevel().getBackground().getWidth();

    GameComponent.player.setPosition(GameComponent.getCurrentLevel().getSpawnPoint());

    this.isFlashlightOn = true;
    GameComponent.player.collectedShines = 0;
    this.flashCount = 0;
    this.flashIterations = 0;



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

  public static backgroundMusic = new Audio('../../../assets/sound/background/Dungeon%20Explorer.mp3');
  public volume: number = localStorage.getItem('volume') ? parseFloat(localStorage.getItem('volume')!) : 1.0;


  protected messageBox = new Sprite("../../../assets/sprites/messagebox/!!!In.png", new Position(0, 0), () => {}, 3);

  private animate() {
    window.requestAnimationFrame(() => this.animate());

    GameComponent.volume = parseFloat(localStorage.getItem('volume') || '1.0');

    localStorage.setItem('volume', this.volume.toString());


    GameComponent.backgroundMusic.volume = GameComponent.volume;

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
    GameComponent.player.drawSprite(this.context!, delta);

    for (let i = 0; i < this.gizmo.length; i++) {
      this.gizmo[i].update(this.context!, delta);
    }

    for (let i = 0; i < this.gizmo.length; i++) {
      this.gizmo[i].drawSprite(this.context!, delta);
    }
    if (GameComponent.getCurrentLevel().getFinalDoor().checkCollision(GameComponent.player) && isKeyPressed('w') && GameComponent.player.collectedKeys >= 1) {
      GameComponent.getCurrentLevel().getFinalDoor().play();
      const audio = new Audio('../../../assets/sound/game/door/open.mp3');
      audio.volume = GameComponent.volume;
      audio.playbackRate = 0.5;
      audio.play().then();
      GameComponent.player.collectedKeys -= 1;
      GameComponent.player.getVelocity().setY(0);
      GameComponent.player.getVelocity().setX(0);
      GameComponent.player.preventInput = true;
      GameComponent.player.switchSprite('enterDoor');

    }






    if(GameComponent.player.collectedShines >= 3){
      if(this.flashIterations < 200) {


        this.flashLight.draw(this.context!, GameComponent.player.getPosition(), delta,250 + (GameComponent.player.collectedShines + 1 + this.flashIterations) * 5 );
        if (this.flashCount < this.flashBuffer) {
          this.flashCount += delta;

        } else {
          this.flashCount = 0;
          this.flashIterations++;
          if(this.flashIterations == 200){
            this.flashIterations = 0;
            this.flashCount = 0;
            this.isFlashlightOn = false;
            GameComponent.player.collectedShines = 0;
            console.log("Flashlight off")
          }
        }
      }
      return;
    }else if(this.isFlashlightOn) this.flashLight.draw(this.context!, GameComponent.player.getPosition(), delta, (GameComponent.player.collectedShines + 1) * 50);

    if(isKeyPressed('f') && !(this.flashLight.cooldown > 0)){
      this.flashLight.toggle();
    }


  }

  private flashCount = 0;
  private flashBuffer = 0.005;
  private flashIterations = 0;


}
