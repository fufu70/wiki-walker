import {HudGameObject} from "../../HudGameObject.js";
import {Animations} from "../../Animations.js";
import {FrameIndexPattern} from "../../FrameIndexPattern.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {SUPPORTED_CHARACTERS} from '../textbox/spriteFontMap.js';
import {Typewriter} from '../../helpers/text/Typewriter.js';


export class LoadingScreen extends HudGameObject {
	constructor(config = {}) {
		super({
			position: new Vector2(0, 0)
		});

		this.drawLayer = "HUD";
		// this.background = new Sprite({
		// 	resource: resources.images.shopBackground,
		// 	frameSize: new Vector2(320, 180)
		// });
		// this.addChild(this.background);
		this.stairs = new Sprite({
			resource: resources.images.loadingScreen,
			frameSize: new Vector2(320, 180),
			hFrames: 3,
			vFrames: 5,
			frame: 0,
			animations: new Animations({
				WALKING_DOWN: new FrameIndexPattern({
					duration: 1400,
					frames: [
						{
							time: 0,
							frame: 0
						},
						{
							time: 200,
							frame: 1
						},
						{
							time: 400,
							frame: 2
						},
						{
							time: 600,
							frame: 3
						},
						{
							time: 800,
							frame: 4
						},
						{
							time: 1000,
							frame: 5
						},
						{
							time: 1200,
							frame: 6
						},
					]
				}),
				STAY_BOTTOM: new FrameIndexPattern({
					duration: 2000,
					frames: [
						{
							time: 0,
							frame: 0
						},
						{
							time: 200,
							frame: 1
						},
						{
							time: 400,
							frame: 2
						},
						{
							time: 600,
							frame: 3
						},
						{
							time: 800,
							frame: 4
						},
						{
							time: 1000,
							frame: 5
						},
						{
							time: 1200,
							frame: 6
						},
						{
							time: 1400,
							frame: 7
						},
						{
							time: 1500,
							frame: 8
						},
						{
							time: 1600,
							frame: 9
						},
						{
							time: 1700,
							frame: 10
						},
						{
							time: 1800,
							frame: 11
						},
						{
							time: 1900,
							frame: 12
						},
					]
				})
			})
		});
		this.stairs.animations.play("WALKING_DOWN");
		this.addChild(this.stairs);
	}

	finish(callback) {
		this.stairs.animations.play("STAY_BOTTOM");
		this.stayBottomTime = 2000;
	}

	step(delta, root) {
		if (this.stayBottomTime > 0) {
			this.workOnStayBottom(delta);
			return;
		}
	}

	workOnStayBottom(delta) {
		this.stayBottomTime -= delta;

		if (this.stayBottomTime <= 0) {
			super.destroy();
		}
	}

	// destroy() {
	// 	setTimeout(() => {
	// 		super.destroy();
	// 	}, 1300);
	// }
}
