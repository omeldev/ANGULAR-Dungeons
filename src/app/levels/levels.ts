import {Level} from "../classes/level/level";
import {Sprite} from "../classes/entitiy/sprite";
import {Position} from "../classes/entitiy/position";
import {
  endDoorIntro,
  endDoorLevel1,
  endDoorLevel2,
  endDoorLevel3,
  endDoorLevel4,
  entryDoorIntro,
  entryDoorLevel1,
  exitDoorIntro,
  exitDoorLevel1
} from "./doors/doors";

export const intro = new Level(new Sprite('../../../assets/maps/intro.png'),
  new Position(1 * 64, 6 * 64 - 16),
  'intro.json',
  endDoorIntro,
  () => {
    intro.addDoor(entryDoorIntro)
    intro.addDoor(exitDoorIntro)
  });

export const level1 = new Level(new Sprite('../../../assets/maps/level1.png'), new Position(64 * 1, 64 * 6), 'level1.json', endDoorLevel1,
  () => {
    level1.addDoor(entryDoorLevel1)
    level1.addDoor(exitDoorLevel1)
  });

export const level2 = new Level(new Sprite('../../../assets/maps/level2.png'), new Position(64 * 3, 64 + 16),
  '', endDoorLevel2);

export const level3 = new Level(new Sprite('../../../assets/maps/level3.png'), new Position(64 * 2, 2 * 64 + 16),
  '', endDoorLevel3);

export const level4 = new Level(new Sprite('../../../assets/maps/level4.png'), new Position(64 * 3, 64 + 16),
  'level4.json',
  endDoorLevel4);
