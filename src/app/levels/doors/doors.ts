import {Door} from "../../classes/level/door/door";
import {Position} from "../../classes/entitiy/position";

export const endDoorIntro = new Door(new Position(64 * 29, 64 * 1 + 16), true);
export const exitDoorIntro = new Door(new Position(64 * 18, 64 * 1 + 16), false);
export const entryDoorIntro = new Door(new Position(64 * 14, 64 * 6 + 16), false, exitDoorIntro);

export const endDoorLevel1 = new Door(new Position(29 * 64, 64 * 1 + 16), true);
export const exitDoorLevel1 = new Door(new Position(64 * 18, 64 * 1 + 16), false);
export const entryDoorLevel1 = new Door(new Position(64 * 15, 64 * 6 + 16), false, exitDoorLevel1);

export const endDoorLevel2 = new Door(new Position(13 * 64, 64 + 16), true);
export const endDoorLevel3 = new Door(new Position(12 * 64, 6 * 64 + 16), true);
export const endDoorLevel4 = new Door(new Position(20 * 64, 10 * 64 + 16), true);

