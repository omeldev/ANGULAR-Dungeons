import {Door} from "../../classes/door/door";
import {Position} from "../../classes/entitiy/position";

export const endDoorLevel1 = new Door(new Position(11 * 64, 64 * 4 + 16), true, new Door(new Position(0, 0), true));
export const endDoorLevel2 = new Door(new Position(13 * 64, 64 + 16), true, new Door(new Position(0, 0), true));
