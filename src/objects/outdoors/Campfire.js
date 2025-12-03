import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {resources} from '../../Resources.js';
import {Animations} from "../../Animations.js";
import {FrameIndexPattern} from "../../FrameIndexPattern.js";
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {storyFlags} from '../../StoryFlags.js';

export class Campfire extends GameObject {
	constructor(x, y, params) {
		super({
			position: new Vector2(x, y),
			isSolid: true
		});
		this.content = params.content;
		this.addChild(new Sprite({
			resource: resources.images.shadow,
			position: new Vector2(-8, -21),
			frameSize: new Vector2(32, 32)
		}));
		const campfire = new Sprite({
			resource: resources.images.campfire,
			position: new Vector2(0, -6),
			frameSize: new Vector2(16, 16),
			hFrames: 2,
			vFrames: 3,
			frame: 5,
			animations: new Animations({
				BURN: new FrameIndexPattern({
					duration: 400,
					frames: [
						{
							time: 0,
							frame: 0
						},
						{
							time: 100,
							frame: 1
						},
						{
							time: 200,
							frame: 2
						},
						{
							time: 300,
							frame: 3
						},
					]
				})
			})
		});
		campfire.animations.play("BURN");
		this.addChild(campfire);
	}

	getContent() {
		const match = storyFlags.getRelevantScenario(this.content);
		if (!match) {
			console.warn("No matches found in this list!", this.content);
			return null;
		}

		return {
			portraitFrame: match.portraitFrame,
			string: match.stringFunc ? match.stringFunc() : match.string,
			...match
		}
	}
}