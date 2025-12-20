import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';

export const DOWN_STAIRS = 'DOWN';
export const CLOSED_STAIRS = 'CLOSED';
export const UP_STAIRS = 'UP';

const EXIT = {};
EXIT[DOWN_STAIRS] = 0;
EXIT[CLOSED_STAIRS] = 1;
EXIT[UP_STAIRS] = 2;

export class Exit extends GameObject {
	constructor(x, y, style = "DOWN") {
		super({
			position: new Vector2(x, y)
		});
		this.style = style;

		this.stairs = new Sprite({
			resource: resources.images.stairs,
			frameSize: new Vector2(16, 32),
			hFrames: 2,
			vFrames: 2,
			frame: EXIT[style],
			position: new Vector2(0, -16) // nudge upwards visually
		});
		this.addChild(this.stairs);
		this.drawLayer = style === UP_STAIRS ? "EXIT_UP" : "EXIT";
	}

	ready() {
		events.on("HERO_POSITION", this, pos => {
			const roundedHeroX = Math.round(pos.x);
			const roundedHeroY = Math.round(pos.y);

			if (roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
				this.enteredSpace();
			}
		});
	}

	close() {
		this.stairs.frame = EXIT[CLOSED_STAIRS];
	}

	enteredSpace() {
		if (this.isUp) {
			events.emit("HERO_EXIT_UP", {
				position: this.position
			});	
		} else {
			events.emit("HERO_EXIT", {
				position: this.position
			});	
		}
	}
}