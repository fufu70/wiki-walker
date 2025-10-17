import {Vector2} from './Vector2.js';
import {GameObject} from './GameObject.js';
import {events} from './Events.js';

export class Sprite extends GameObject {
	constructor({
		resource,  // image we want to draw
		frameSize, // size of the crop of the image
		hFrames,   // how the sprite arraged horizontally
		vFrames,   // how the sprite arranged vertically
		frame,     // which frame we want to show
		scale,     // how large to draw the image
		position,  // x and y coordinates 
		animations,
		alwaysRender
	}) {
		super({alwaysRender});

		this.resource = resource;
		this.frameSize = frameSize ?? new Vector2(16, 16);
		this.hFrames = hFrames ?? 1;
		this.vFrames = vFrames ?? 1;
		this.frame = frame ?? 0;
		this.frameMap = new Map();
		this.scale = scale ?? 1;
		this.position = position ?? new Vector2(0, 0);
		this.animations = animations ?? null;
		this.buildFrameMap();
	}

	clone() {
		return new Sprite({
			resource: this.resource,
			frameSize: this.frameSize,
			hFrames: this.hFrames,
			vFrames: this.vFrames,
			frame: this.frame,
			frameMap: this.frameMap,
			scale: this.scale,
			position: this.position,
			animations: this.animations,
		});
	}

	buildFrameMap() {
		let frameCount = 0;
		for (let v = 0; v < this.vFrames; v ++) {
			for (let h = 0; h < this.hFrames; h ++) {
				this.frameMap.set(
					frameCount,
					new Vector2(h * this.frameSize.x, v * this.frameSize.y)
				);
				frameCount ++;
			}
		}
	}

	step(delta) {
		if (!this.animations || typeof this.animations?.step !== 'function') {
			return;
		}

		this.animations.step(delta);
		this.frame = this.animations.frame;
	}

	drawImage(ctx, x, y) {
		if (!this.inRenderView(x, y)) {
			return;
		}

		if (!this.resource.isLoaded) {
			return;
		}

		let frameCoordX = 0;
		let frameCoordY = 0;
		const frame = this.frameMap.get(this.frame);
		if (frame) {
			frameCoordX = frame.x;
			frameCoordY = frame.y;
		}

		const frameSizeX = this.frameSize.x;
		const frameSizeY = this.frameSize.y;

		ctx.drawImage(
			this.resource.image,
			frameCoordX,	             // top X corner of the frame
			frameCoordY,	             // top Y corner of the frame
			frameSizeX,	             	 // how much to crop from the sprite sheet (X)
			frameSizeY,	             	 // how much to crop from the sprite sheet (Y)
			x,		             		 // where to place this on canvas (X)
			y,		             	 	 // where to place this on canvas (Y)	
			frameSizeX * this.scale, // how large to scale (X)
			frameSizeY * this.scale  // how large to scale (Y)
		);
	}
}