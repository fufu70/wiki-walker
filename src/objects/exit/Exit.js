import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';


export class Exit extends GameObject {
	constructor(x, y, isUp = false) {
		super({
			position: new Vector2(x, y)
		});

		const sprite = new Sprite({
			resource: resources.images.stairs,
			frameSize: new Vector2(16, 32),
			hFrames: 2,
			vFrames: 1 ,
			frame: isUp ? 1 : 0,
			position: new Vector2(0, -16) // nudge upwards visually
		});
		this.addChild(sprite);

		this.drawLayer = "EXIT";
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

	enteredSpace() {
		events.emit("HERO_EXIT", {
			position: this.position
		});
	}
}