import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {OrientationFactory} from '../../helpers/orientation/OrientationFactory.js';
import {RoomWallFactory} from './Wall.js';
import {
	NORTH_RIGHT,
	NORTH,
	NORTH_LEFT,
	NORTH_WEST_CORNER,
	NORTH_WEST,
	WEST_TOP,
	WEST,
	WEST_BOTTOM,
	SOUTH_WEST,
	SOUTH_WEST_CORNER,
	SOUTH_LEFT,
	SOUTH,
	SOUTH_RIGHT,
	SOUTH_EAST,
	SOUTH_EAST_CORNER,
	EAST_BOTTOM,
	EAST,
	EAST_TOP,
	NORTH_EAST,
	NORTH_EAST_CORNER,
} from '../../helpers/orientation/Orientation.js';

const TRIM = {};
// TRIM.NORTH_RIGHT = 24;
// TRIM.NORTH = 63;
// TRIM.NORTH_LEFT = 23;
TRIM[NORTH_WEST_CORNER] = 7;
TRIM[NORTH_WEST] = 24;
TRIM[WEST_TOP] = 28;
TRIM[WEST] = 45;
TRIM[WEST_BOTTOM] = 45;
TRIM[SOUTH_WEST] = 62;
TRIM[SOUTH_WEST_CORNER] = 39;
TRIM[SOUTH_LEFT] = 63;
TRIM[SOUTH] = 63;
TRIM[SOUTH_RIGHT] = 63;
TRIM[SOUTH_EAST] = 64;
TRIM[SOUTH_EAST_CORNER] = 40;
TRIM[EAST_BOTTOM] = 47;
TRIM[EAST] = 47;
TRIM[EAST_TOP] = 30;
TRIM[NORTH_EAST] = 29;
TRIM[NORTH_EAST_CORNER] = 29;

export class Trim extends GameObject {
	constructor(x, y, orientation = NORTH) {
		super({
			position: new Vector2(x, y)
		});
		if (orientation === NORTH_WEST) {
			this.addMidTopTrim(WEST_TOP);
		} else if (orientation === NORTH_EAST) {
			this.addMidTopTrim(EAST_TOP);
		} else if (orientation === WEST_TOP || orientation === EAST_TOP) {
			this.addTopTrim(orientation);
		} else {
			this.addTrim(orientation);
		}

		this.drawLayer = "TRIM";
	}


	addMidTopTrim(orientation) {
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation],
			position: new Vector2(0, gridCells(-1))
		}));
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation.replace("_TOP", "")]
		}));
	}

	addTopTrim(orientation) {
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation],
			position: new Vector2(0, gridCells(-2))
		}));
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation.replace("_TOP", "")],
			position: new Vector2(0, gridCells(-1))
		}));
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation.replace("_TOP", "")]
		}));
	}

	addTrim(orientation) {
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation]
		}));
	}
}

export class TrimFactory {
	static cache = new Map();

	static generate(params) {
		if (TrimFactory.cache.has(JSON.stringify(params.floorPlan))) {
			return TrimFactory.cache.get(JSON.stringify(params.floorPlan));
		}
		let {floorPlan} = params;
		let walls = RoomWallFactory.generate(params);
		TrimFactory.cache.set(JSON.stringify(params.floorPlan), walls);
		return new TrimFactory().get(floorPlan, walls);
	}

	get(floorPlan, walls) {
		const trims = [];
		floorPlan.traverse({
			callback: (x, y, positionValue) => {
				if (
					positionValue != 0 || this.isWall(x, y, walls)
				) {
					return;
				}

				// let orientations = OrientationFactory.getExtractedOrientations(floorPlan.neighborContrast(x, y));
				let orientations = OrientationFactory.getOrientations(x, y, floorPlan);
				if (orientations === undefined) {
					return;
				}
				for (var i = 0; i < orientations.length; i++) {
					trims.push(new Trim(gridCells(x), gridCells(y), orientations[i]));
				}

				// JobManager.runJob("", {
				// 		x: x,
				// 		y: y,
				// 		matrixValue: matrixValue
				// }, (output) => {
				// 	if (output.orientations === undefined) {
				// 		return;
				// 	}
				// 	for (var i = 0; i < output.orientations.length; i++) {
				// 		trims.push(new Trim(gridCells(output.x), gridCells(output.y), output.orientations[i]));
				// 	}
				// });
			},
			padding: 2
		});

		return trims;
	}

	isWall(x, y, walls) {
		for (var i = walls.length - 1; i >= 0; i--) {
			if (
				Math.floor(walls[i].position.x / 16) === x 
				&& Math.floor(walls[i].position.y / 16) === y
			) {
				return true;
			}
		}
		return false;
	}
}