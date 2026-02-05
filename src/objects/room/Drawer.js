import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {events} from '../../Events.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {Story} from '../../stories/Story.js';
import {VIEW_TABLE_FLAG} from '../../stories/constants.js';

export const LIGHT_BROWN_FULL = 'LIGHT_BROWN_FULL';
export const LIGHT_BROWN_MID = 'LIGHT_BROWN_MID';
export const BROWN_MID = 'BROWN_MID';

export const DRAWER_STYLES = [
	LIGHT_BROWN_FULL,
	LIGHT_BROWN_MID,
	BROWN_MID,
]

const DRAWER = {};
DRAWER[LIGHT_BROWN_FULL] = 0;
DRAWER[LIGHT_BROWN_MID] = 1;
DRAWER[BROWN_MID] = 2;

export class Drawer extends GameObject {
	constructor(x, y, style = LIGHT_BROWN_FULL, seed = undefined, params = undefined) {
		super({
			position: new Vector2(x, y),
			size: new Vector2(GRID_SIZE * 2, GRID_SIZE),
			isSolid: true
		});

		if (seed !== undefined) {
			style = DRAWER_STYLES[Math.floor(seed() * DRAWER_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.drawer,
			frameSize: new Vector2(32, 32),
			position: new Vector2(0, -16),
			hFrames: 2,
			vFrames: 2,
			frame: DRAWER[style]
		}));

		this.drawLayer = "DRAWER";

		if (params) {
			this.table = params.table;
		}

		const viewTable = events.on("SUBMIT_INPUT_TEXT", this, ({config, text}) => {

			if (config.uuid !== this.uuid) {
				return;
			}

			if (Story.isConfirmation(text)) {
				events.emit("SHOW_TABLE", {
					table: this.table
				});
			}
		});
	}

	getContent() {
		this.question = Story.getDialog(VIEW_TABLE_FLAG);
		if (this.table !== undefined) {
			return {
				eventType: "SELECT_INPUT",
				string: this.question,
				uuid: this.uuid,
				options: Story.getConfirmationOptions()
			}
		}

		return {
			string: "A drawer filled with junk. It belongs on a hoarders show.",
		}
	}
}