import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {Animations} from "../../Animations.js";
import {FrameIndexPattern} from "../../FrameIndexPattern.js";
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';

export const NEWS = 'NEWS';
export const COOKING = 'COOKING';
export const NATURE = 'NATURE';
export const ALIENS = 'ALIENS';
export const OFF = 'OFF';

export const TELEVISION_STYLES = [
	NEWS,
	COOKING,
	NATURE,
	ALIENS,
	OFF,
]

const TELEVISION = {};
TELEVISION[NEWS] = 0;
TELEVISION[COOKING] = 1;
TELEVISION[NATURE] = 2;
TELEVISION[ALIENS] = 3;
TELEVISION[OFF] = 4;

export class Television extends GameObject {
	constructor(x, y, style = NEWS, seed = undefined, params = undefined) {
		super({
			position: new Vector2(x, y),
			size: new Vector2(GRID_SIZE * 2, GRID_SIZE)
		});

		// if (seed !== undefined) {
		// 	style = TELEVISION_STYLES[Math.floor(seed() * (TELEVISION_STYLES.length - 1))];
		// }

		const television = new Sprite({
			resource: resources.images.television,
			frameSize: new Vector2(32, 16),
			position: new Vector2(0, -10),
			hFrames: 1,
			vFrames: 6,
			frame: TELEVISION[style],
			animations: new Animations({
				TOGGLE_SCREEN: new FrameIndexPattern({
					duration: 15000,
					frames: [
						{
							time: 0,
							frame: TELEVISION[OFF]
						},
						{
							time: 500,
							frame: TELEVISION[NEWS]
						},
						{
							time: 4000,
							frame: TELEVISION[OFF]
						},
						{
							time: 4500,
							frame: TELEVISION[COOKING]
						},
						{
							time: 8000,
							frame: TELEVISION[OFF]
						},
						{
							time: 8500,
							frame: TELEVISION[NATURE]
						},
						{
							time: 11000,
							frame: TELEVISION[OFF]
						},
						{
							time: 11500,
							frame: TELEVISION[ALIENS]
						},
					]
				})
			})
		});
		television.animations.play("TOGGLE_SCREEN");
		this.addChild(television);

		if (params) {
			this.content = params.caption;
			this.urls = params.urls;
		}

		const viewVideo = events.on("SUBMIT_INPUT_TEXT", this, ({config, text}) => {

			if (config.uuid !== this.uuid) {
				return;
			}

			if (text == "Yes") {
				events.emit("SHOW_VIDEO", {
					urls: this.urls
				});
			}
		});
	}

	getContent() {
		this.question = `${this.content} View video?`;
		if (this.content !== undefined) {
			return {
				eventType: "SELECT_INPUT",
				string: this.question,
				uuid: this.uuid,
				options: ["Yes", "No"]
			}
		}
		return {
			string: "I wonder what's playing on the TV",
		}
	}
}