import {GameObject} from "../../GameObject.js";
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

export class TrimStorage extends Storage {

	constructor() {
		super("TRIM");
	}

	get(floorPlan) {
		const value = super.get(JSON.stringify(floorPlan));
		return value.map(val => {
			return new Trim(gridCells(val.x), gridCells(val.y), val.orientation);
		});
	}

	set(floorPlan, value) {
		super.set(JSON.stringify(floorPlan), value);
	}
}

export class TrimFactory {
	static cache = new TrimStorage();

	static generate(params) {
		let {floorPlan} = params;
		if (TrimFactory.cache.has(floorPlan)) {
			return TrimFactory.cache.get(floorPlan);
		}
		let walls = RoomWallFactory.generate(params);
		let trim = new TrimFactory().get(floorPlan, walls)
		TrimFactory.cache.set(floorPlan, trim);
		return TrimFactory.cache.get(floorPlan);
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
					trims.push({x, y, orientation: orientations[i]});
				}
			},
			padding: 2
		});

		return trims;
	}




	static async generateParallel(params) {
		if (TrimFactory.cache.has(JSON.stringify(params.floorPlan))) {
			return TrimFactory.cache.get(JSON.stringify(params.floorPlan));
		}
		let {floorPlan} = params;
		let walls = RoomWallFactory.generate(params);
		TrimFactory.cache.set(JSON.stringify(params.floorPlan), walls);
		return await (new (this.prototype.constructor)()).getParallel(floorPlan, walls);
	}

	async getParallel(floorPlan, walls) {
		let methodCall = (input) => {
			let floorPlan = new Matrix(input.floorPlan);
			let isWall = eval(input.isWallString)
			const walls = input.walls;

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
				padding: 2
			});

			return trims;
		}

		let lambda = `
			${Matrix.toString()}
			SKIP = ${SKIP}
			EMPTY = ${EMPTY}
			ORIENTATIONS = ${JSON.stringify(ORIENTATIONS)}
			OUTLINES = ${JSON.stringify(OUTLINES)}
			${OrientationFactory.toString()}
			${methodCall.toString()}
		`;


		console.log("LAMBDA", lambda.toString())
		console.log("WALLS", walls);
		const input = {
			floorPlan: floorPlan,
			walls: JSON.parse(JSON.stringify(walls)),
			isWallString: `(function ${this.isWall.toString()})`
		};
		console.log("INPUT", JSON.parse(JSON.stringify(input)));
		return new Promise((resolve, reject) => {
			JobManager.runJob(lambda.toString(), JSON.parse(JSON.stringify(input)), (out) => {
				console.log("JobManager", out)
				const trim = out.map(trim => {
					return new Trim(gridCells(trim.x), gridCells(trim.y), trim.orientation);
				})
				resolve(trim);
			});
	    });
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