import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Story} from '../../stories/Story.js';
import {VIEW_IMAGE_FLAG} from '../../stories/constants.js';

export const MODERN = 'MODERN';
export const EVIL_PURPLE = 'EVIL_PURPLE';
export const EVIL_BLACK = 'EVIL_BLACK';
export const SPLATTER = 'SPLATTER';
export const MOUNTAIN = 'MOUNTAIN';
export const FIRE = 'FIRE';

export const PICTURE_STYLES = [
	MODERN,
	EVIL_PURPLE,
	EVIL_BLACK,
	SPLATTER,
	MOUNTAIN,
	FIRE,
]

const PICTURE = {};
PICTURE[MODERN] = 0;
PICTURE[EVIL_PURPLE] = 1;
PICTURE[EVIL_BLACK] = 2;
PICTURE[SPLATTER] = 3;
PICTURE[MOUNTAIN] = 4;
PICTURE[FIRE] = 5;

export class Picture extends GameObject {
	constructor(x, y, style = MODERN, seed = undefined, params = undefined) {
		super({
			position: new Vector2(x, y)
		});

		if (seed !== undefined) {
			style = PICTURE_STYLES[Math.floor(seed() * PICTURE_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.picture,
			position: new Vector2(0, -10),
			hFrames: 1,
			vFrames: 6,
			frame: PICTURE[style]
		}));


		if (params) {
			this.content = params.caption;
			this.url = params.url;
		}

		const viewImage = events.on("SUBMIT_INPUT_TEXT", this, ({config, text}) => {

			if (config.uuid !== this.uuid) {
				return;
			}

			if (Story.isConfirmation(text)) {
				events.emit("SHOW_IMAGE", {
					url: this.url
				});
			}
		});
	}

	getContent() {
		this.question = `${this.content} ${Story.getDialog(VIEW_IMAGE_FLAG)}`;
		if (this.content !== undefined) {
			return {
				eventType: "SELECT_INPUT",
				string: this.question,
				uuid: this.uuid,
				options: Story.getConfirmationOptions()
			}
		}

		return {
			string: "My dog could draw better than that!",
		}
	}
}