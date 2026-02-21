import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
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


export class Wall extends GameObject {
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


export class RoomWallStorage extends Storage {
	constructor() {
		super("WALL");
	}

	get(floorPlan) {
		const value = super.get(JSON.stringify(floorPlan));
		return value.map(val => {
			return new Wall(gridCells(val.x), gridCells(val.y), val.style, val.orientation);
		});
	}

	set(floorPlan, value) {
		super.set(JSON.stringify(floorPlan), value);
	}
}

export class WallFactory {

	static generateCache(params) {
		let {floorPlan, seed, style} = params;
		let factory = new (this.prototype.constructor)();

		if (factory.cache.has(floorPlan)) {
			return factory.cache.get(floorPlan);
		}
		const walls = factory.get(floorPlan, seed, style);
		factory.cache.set(floorPlan, walls);
		return factory.cache.get(floorPlan);
	}

	static generate(params) {
		let {floorPlan, seed, style} = params;
		let factory = new (this.prototype.constructor)();

		const walls = factory.get(floorPlan, seed, style);
		return walls;
	}

	get(floorPlan, seed, style) {
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
			padding: 2
		});

		return walls.map(val => {
			return new Wall(gridCells(val.x), gridCells(val.y), val.style, val.orientation);
		});
	}


	static async generateParallel(params) {
		if (WallFactory.cache.has(JSON.stringify(params.floorPlan))) {
			return WallFactory.cache.get(JSON.stringify(params.floorPlan));
		}
		let {floorPlan, seed, style} = params;
		return await (new (this.prototype.constructor)()).getParallel(floorPlan, seed, style);
	}

	async getParallel(floorPlan, seed, style) {
		if (!style && seed) {
			style = this.seedStyle(seed);
		}


		let methodCall = (input) => {
			let floorPlan = new Matrix(input.floorPlan);
			let seed = input.seed;
			let style = input.style;
			let isWall = eval(input.isWallString)
			const walls = [];

			floorPlan.traverse({
				callback: (x, y, matrixValue) => {
					if (!isWall(x, y, matrixValue, floorPlan)) {
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
					walls.push({x, y, orientation, style});
				},
				padding: 2
			});

			return walls;
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
		const input = {
			floorPlan: floorPlan,
			seed: seed,
			style: style,
			isWallString: `(function ${this.isWall.toString()})`
		};
		console.log("INPUT", JSON.parse(JSON.stringify(input)));
		return new Promise((resolve, reject) => {
			JobManager.runJob(lambda.toString(), JSON.parse(JSON.stringify(input)), (out) => {
				console.log("JobManager", out)
				const walls = out.map(wall => {
					return this.getWallSprite(wall.x, wall.y, wall.style, wall.orientation);
				});

				WallFactory.cache.set(JSON.stringify(floorPlan), walls);
				resolve(walls);
			});
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
	cache = new RoomWallStorage();

	isWall(x, y, matrixValue, floorPlan) {
		return floorPlan.get(x, y + 1) > 0 && matrixValue == 0
	}
}