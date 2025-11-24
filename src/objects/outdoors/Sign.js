import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {resources} from '../../Resources.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {storyFlags} from '../../StoryFlags.js';

export class Sign extends GameObject {
	constructor(x, y, params) {
		super({
			position: new Vector2(x, y),
			isSolid: true
		});

		this.content = params.content;


		const shadow = new Sprite({
			resource: resources.images.shadow,
			frameSize: new Vector2(32, 32),
			position: new Vector2(-8, -19  )
		});
		this.addChild(shadow);


		this.addChild(new Sprite({
			resource: resources.images.sign,
			position: new Vector2(0, -22),
			frameSize: new Vector2(16, 32),
			hFrames: 1,
			vFrames: 1,
			frame: 0
		}));
	}

	getContent() {
		return storyFlags.heroReads(this.content);
	}
}