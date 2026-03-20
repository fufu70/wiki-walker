import {CloneObject} from "../CloneObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Storage} from '../../helpers/Storage.js';

import {SKIP, EMPTY, Matrix} from "../../Matrix.js";
import {ORIENTATIONS} from '../../helpers/orientation/Orientation.js';
import {OUTLINES} from '../../helpers/orientation/Outlines.js';
import {OrientationFactory} from '../../helpers/orientation/OrientationFactory.js';
import {JobManager} from '../../helpers/JobManager.js';

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

export class Trim extends CloneObject {
	constructor(x, y, orientation = NORTH) {
		super({
			position: new Vector2(x, y)
		});
		this.orientation = orientation;
		this.formatOrientation(this.orientation);

		this.drawLayer = "TRIM";
	}

	formatOrientation(orientation) {
		if (orientation === NORTH_WEST) {
			this.addMidTopTrim(WEST_TOP);
		} else if (orientation === NORTH_EAST) {
			this.addMidTopTrim(EAST_TOP);
		} else if (orientation === WEST_TOP || orientation === EAST_TOP) {
			this.addTopTrim(orientation);
		} else {
			this.addTrim(orientation);
		}
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

	reflect(trim) {
		this.orientation = trim.orientation;
		this.formatOrientation(trim.orientation);
	}
}

export class TrimFactory {

	static generate(params) {
		return this.create(params);
	}

	create(params) {
		let {floorPlan, position, size} = params;
		let walls = RoomWallFactory.generate(params);
		let trim = this.get(floorPlan, position, size, walls);
		return trim.map(val => {
			return new Trim(gridCells(val.x), gridCells(val.y), val.orientation);
		});
	}

	get(floorPlan, position, size, walls) {
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
					trims.push({x, y, orientation: orientations[i]});
				}
			},
			padding: 2,
			position: position,
			size: size
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