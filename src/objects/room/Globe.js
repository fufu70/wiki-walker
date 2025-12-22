import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';

export const GOLD = 'GOLD';
export const SILVER = 'SILVER';

export const GLOBE_STYLES = [
	GOLD,
	SILVER
]

const GLOBE = {};
GLOBE[GOLD] = 0;
GLOBE[SILVER] = 1;

export class Globe extends GameObject {
	constructor(x, y, style = GOLD, seed = undefined, params = undefined) {
		super({
			position: new Vector2(x, y),
			isSolid: true
		});

		if (seed !== undefined) {
			style = GLOBE_STYLES[Math.floor(seed() * GLOBE_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.shadow,
			position: new Vector2(-8, -19),
			frameSize: new Vector2(32, 32),
		}));
		this.addChild(new Sprite({
			resource: resources.images.globe,
			position: new Vector2(0, -18),
			frameSize: new Vector2(16, 32),
			hFrames: 1,
			vFrames: 2,
			frame: GLOBE[style]
		}));


		if (params) {
			this.content = params.caption;
			this.coordinates = params.coordinates;
		}

		const viewImage = events.on("SUBMIT_INPUT_TEXT", this, ({config, text}) => {

			if (config.uuid !== this.uuid) {
				return;
			}

			if (text == "Yes") {
				events.emit("SHOW_Map", {
					coordinates: this.coordinates
				});
			}
		});
	}

	getContent() {
		this.question = `${this.content} View map?`;
		if (this.content !== undefined) {
			return {
				eventType: "SELECT_INPUT",
				string: this.question,
				uuid: this.uuid,
				options: ["Yes", "No"]
			}
		}

		return {
			string: "Spin spin spin the globe",
		}
	}
}