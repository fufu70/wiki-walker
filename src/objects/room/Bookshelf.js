import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {storyFlags} from '../../StoryFlags.js';

export const LIGHT_BROWN_FULL = 'LIGHT_BROWN_FULL';
export const LIGHT_BROWN_MID = 'LIGHT_BROWN_MID';
export const BROWN_MID = 'BROWN_MID';
export const BROWN_FULL = 'BROWN_FULL';
export const DARK_BROWN_FULL = 'DARK_BROWN_FULL';
export const DARK_BROWN_MID = 'DARK_BROWN_MID';
export const ANTIUQUE_FULL = 'ANTIUQUE_FULL';
export const ANTIUQUE_EMPTY = 'ANTIUQUE_EMPTY';
export const CART = 'CART';
export const LIBRARY_SINGLE = 'LIBRARY_SINGLE';
export const LIBRARY_DOUBLE = 'LIBRARY_DOUBLE';
export const SCHOOL_PINE_A = 'SCHOOL_PINE_A';
export const SCHOOL_PINE_B = 'SCHOOL_PINE_B';
export const SCHOOL_PINE_C = 'SCHOOL_PINE_C';
export const SCHOOL_PINE_D = 'SCHOOL_PINE_D';
export const SCHOOL_PINE_E = 'SCHOOL_PINE_E';
export const SCHOOL_PINE_F = 'SCHOOL_PINE_F';
export const SCHOOL_POPLAR_A = 'SCHOOL_POPLAR_A';
export const SCHOOL_POPLAR_B = 'SCHOOL_POPLAR_B';
export const SCHOOL_POPLAR_C = 'SCHOOL_POPLAR_C';
export const SCHOOL_POPLAR_D = 'SCHOOL_POPLAR_D';
export const SCHOOL_POPLAR_E = 'SCHOOL_POPLAR_E';
export const SCHOOL_POPLAR_F = 'SCHOOL_POPLAR_F';

export const BOOKSHELF_STYLES = [
	LIGHT_BROWN_FULL,
	LIGHT_BROWN_MID,
	BROWN_MID,
	BROWN_FULL,
	DARK_BROWN_FULL,
	DARK_BROWN_MID,
	ANTIUQUE_FULL,
	ANTIUQUE_EMPTY,
	CART,
	LIBRARY_SINGLE,
	LIBRARY_DOUBLE,
	SCHOOL_PINE_A,
	SCHOOL_PINE_B,
	SCHOOL_PINE_C,
	SCHOOL_PINE_D,
	SCHOOL_PINE_E,
	SCHOOL_PINE_F,
	SCHOOL_POPLAR_A,
	SCHOOL_POPLAR_B,
	SCHOOL_POPLAR_C,
	SCHOOL_POPLAR_D,
	SCHOOL_POPLAR_E,
	SCHOOL_POPLAR_F,
]

const BOOKSHELF = {};
BOOKSHELF[LIGHT_BROWN_FULL] = 0;
BOOKSHELF[LIGHT_BROWN_MID] = 1;
BOOKSHELF[BROWN_MID] = 2;
BOOKSHELF[BROWN_FULL] = 3;
BOOKSHELF[DARK_BROWN_FULL] = 4;
BOOKSHELF[DARK_BROWN_MID] = 5;
BOOKSHELF[ANTIUQUE_FULL] = 6;
BOOKSHELF[ANTIUQUE_EMPTY] = 7;
BOOKSHELF[CART] = 8;
BOOKSHELF[LIBRARY_SINGLE] = 9;
BOOKSHELF[LIBRARY_DOUBLE] = 10;
BOOKSHELF[SCHOOL_PINE_A] = 11;
BOOKSHELF[SCHOOL_PINE_B] = 12;
BOOKSHELF[SCHOOL_PINE_C] = 13;
BOOKSHELF[SCHOOL_PINE_D] = 14;
BOOKSHELF[SCHOOL_PINE_E] = 15;
BOOKSHELF[SCHOOL_PINE_F] = 16;
BOOKSHELF[SCHOOL_POPLAR_A] = 17;
BOOKSHELF[SCHOOL_POPLAR_B] = 18;
BOOKSHELF[SCHOOL_POPLAR_C] = 19;
BOOKSHELF[SCHOOL_POPLAR_D] = 20;
BOOKSHELF[SCHOOL_POPLAR_E] = 21;
BOOKSHELF[SCHOOL_POPLAR_F] = 22;

export class Bookshelf extends GameObject {
	constructor(x, y, style = LIGHT_BROWN_FULL, seed = undefined, params = undefined) {
		super({
			position: new Vector2(x, y),
			size: new Vector2(GRID_SIZE * 2, GRID_SIZE),
			isSolid: true
		});

		this.content = params?.content ?? "Book Book, go away, now what will I read today.";

		if (seed !== undefined) {
			style = BOOKSHELF_STYLES[Math.floor(seed() * BOOKSHELF_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.bookshelf,
			frameSize: new Vector2(32, 48),
			position: new Vector2(0, -32),
			hFrames: 6,
			vFrames: 4,
			frame: BOOKSHELF[style]
		}));

		this.drawLayer = "BOOKSHELF";
	}


	getContent() {
		return storyFlags.heroReads(this.content);
	}
}