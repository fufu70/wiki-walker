import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {storyFlags} from '../../StoryFlags.js';

export const BLUE_DIAGONAL = 'BLUE_DIAGONAL';
export const BLUE_STRIPE = 'BLUE_STRIPE';
export const GOLD_STRIPE = 'GOLD_STRIPE';
export const PLAIN = 'PLAIN';
export const HONEY_COVERED = 'HONEY_COVERED';
export const GREEN_DIAGONAL = 'GREEN_DIAGONAL';

export const VASE_STYLES = [
	BLUE_DIAGONAL,
	BLUE_STRIPE,
	GOLD_STRIPE,
	PLAIN,
	HONEY_COVERED,
	GREEN_DIAGONAL,
]

const VASE = {};
VASE[BLUE_DIAGONAL] = 0;
VASE[BLUE_STRIPE] = 1;
VASE[GOLD_STRIPE] = 2;
VASE[PLAIN] = 3;
VASE[HONEY_COVERED] = 4;
VASE[GREEN_DIAGONAL] = 5;

export class Vase extends GameObject {
	constructor(x, y, params = {}) {
		// style = BLUE_DIAGONAL, seed = undefined
		super({
			position: new Vector2(x, y),
			isSolid: true
		});
		let style = params.style === undefined ? BLUE_DIAGONAL : params.style;

		if (params.seed !== undefined) {
			style = VASE_STYLES[Math.floor(params.seed() * 6)];
		}
		this.content = params.content === undefined ? [{
			string: "Huh, just a Vase",
		}] : params.content;

		this.addChild(new Sprite({
			resource: resources.images.shadow,
			position: new Vector2(-8, -21),
			frameSize: new Vector2(32, 32)
		}));
		this.addChild(new Sprite({
			resource: resources.images.vase,
			position: new Vector2(0, -5),
			hFrames: 1,
			vFrames: 6,
			frame: VASE[style]
		}));
	}

	// getContent() {
	// 	return {
	// 		string: "Huh, just a Vase",
	// 	}
	// }
	getContent() {
		// explain story logic
		const match = storyFlags.getRelevantScenario(this.content);
		if (!match) {
			console.warn("No matches found in this list!", this.content);
			return null;
		}

		return {
			portraitFrame: match.portraitFrame,
			string: match.stringFunc ? match.stringFunc() : match.string,
			addFlags: match.addsFlag ?? null,
			eventType: match.eventType ?? null,
			options: match.options ?? null
		}
	}
}