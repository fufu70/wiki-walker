import {CloneObject} from "../CloneObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../resources/SpriteResources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Storage} from '../../helpers/Storage.js';
import {
	NORTH_SINGLE,
	NORTH_RIGHT,
	NORTH,
	NORTH_LEFT
} from '../../helpers/orientation/Orientation.js';
import {
	RED_PATTERN,
	PATTERNS,
	WALLS
} from './constants/Walls.js';
import {SKIP, EMPTY, Matrix} from "../../Matrix.js";
import {ORIENTATIONS} from '../../helpers/orientation/Orientation.js';
import {OUTLINES} from '../../helpers/orientation/Outlines.js';
import {OrientationFactory} from '../../helpers/orientation/OrientationFactory.js';
import {JobManager} from '../../helpers/JobManager.js';


export class Wall extends CloneObject {
	constructor(x, y, style = RED_PATTERN, orientation = NORTH) {
		super({
			position: new Vector2(x, y)
		});
		this.drawLayer = 'WALL';
		if (WALLS[style] === undefined 
			|| WALLS[style][orientation] === undefined
			|| WALLS[style][orientation]["TopWall"]=== undefined) {
			console.error("ERROR for WALL", style, orientation);
			return;
		}
		const topWall = new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: WALLS[style][orientation]["TopWall"],
			position: new Vector2(0, - 16)
		});
		this.addChild(topWall);
		const bottomWall = new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: WALLS[style][orientation]["BottomWall"]
		});
		this.addChild(bottomWall);
	}
}

export class WallFactory {

	static generate(params) {
		return new (this.prototype.constructor)().create(params);
	}

	create(params) {
		let {floorPlan, seed, style, position, size} = params;
		const walls = this.get(floorPlan, seed, style, position, size);
		return walls;
	}

	get(floorPlan, seed, style, position, size) {
		if (!style && seed) {
			style = this.seedStyle(seed);
		}

		const walls = [];
		floorPlan.traverse({
			callback: (x, y, matrixValue) => {
				if (!this.isWall(x, y, matrixValue, floorPlan)) {
					return;
				}
				
				let orientation = OrientationFactory.getOrientation(x, y, floorPlan);
				// let orientation = OrientationFactory.getExtractedOrientation(floorPlan.neighborContrast(x, y));
				if (orientation === undefined) {
					return;
				}
				// console.log("orientation", orientation);
				// const fpMatrixExtract = floorPlan.extract(x - 1, y - 1, 3, 3).compare(0);

				// console.log(fpMatrixExtract.toString());
				walls.push({x, y, style, orientation});
			},
			padding: 2,
			position: position,
			size: size
		});

		return walls.map(val => {
			return new Wall(gridCells(val.x), gridCells(val.y), val.style, val.orientation);
		});
	}
	
	isWall(x, y, matrixValue, floorPlan) {
		// not defined
	}

	getWallSprite(x, y, orientation, style) {
		// not defined
	}

	seedStyle(seed) {
		return PATTERNS[Math.floor(PATTERNS.length * seed())];
	}
}

export class RoomWallFactory extends WallFactory {

	isWall(x, y, matrixValue, floorPlan) {
		return floorPlan.get(x, y + 1) > 0 && matrixValue == 0
	}
}