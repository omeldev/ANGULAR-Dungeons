import {Door} from "../../classes/door/door";
import {Position} from "../../classes/entitiy/position";

export const endDoorLevel1 = new Door(new Position(11 * 64, 64 * 4 + 16), true);
export const endDoorLevel2 = new Door(new Position(13 * 64, 64 + 16), true);
export const endDoorLevel3 = new Door(new Position(12 * 64, 6 * 64 + 16), true);
export const endDoorLevel4 = new Door(new Position(20 * 64, 10*64 + 16), true);

