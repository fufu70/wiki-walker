import {Level} from '../objects/level/Level.js';
import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from '../Sprite.js';
import {moveTowards} from '../helpers/Move.js';
import {resources} from '../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js'
import {events} from '../Events.js';
import {Hero} from '../objects/hero/Hero.js';
import {Rod} from '../objects/rod/Rod.js';
import {Exit} from '../objects/exit/Exit.js';
import {Npc} from '../objects/npc/Npc.js';
import {OutdoorLevel1} from './OutdoorLevel1.js';
import {CaveLevel1} from './CaveLevel1.js';
import {TALKED_TO_A, TALKED_TO_B} from '../StoryFlags.js';
import {WalkFactory, WalkFactoryQuery} from '../helpers/WalkFactory.js';
import {Matrix} from '../Matrix.js';
import {OrientationFactory} from '../helpers/orientation/OrientationFactory.js';

const DEFAULT_HERO_POSITION = new Vector2(gridCells(3), gridCells(3));

export class DrunkardWalkLevel extends Level {

	constructor(params={}) {
		super();
		// console.log("PARAMS: ", params);
		try {
			this.params = params;
			this.background = params.background ?? new Sprite({
				resource: resources.images.shopBackground,
				frameSize: new Vector2(320, 180),
				alwaysRender: true
			});

			this.gameObjects = [];
			this.floors = [];
			this.wallSprites = [];
			if (params.seedNumber !== undefined) {
				params.seed = Math.seed(params.seedNumber);
			}
			this.seed = params.seed ?? Math.seed(Math.random());
			params.seed = this.seed;
			this.floorQuery = new WalkFactoryQuery(params);
			this.floorPlan = this.buildFloorPlan(this.floorQuery);
			this.walls = new Set();

			if (params.showNextLevel === undefined || params.showNextLevel === true) {
				this.addNextLevelExit();
			}

			this.heroStart = params.heroPosition ?? this.findHighestPosition(this.floorPlan);
			if (params.showPreviousLevel === undefined || params.showPreviousLevel === true) {
				this.addPreviousLevelExit(this.heroStart);
			}
			this.addHero(this.heroStart);
			this.beforeGeneratingSprites();

			this.addFloors(this.floorPlan, params);

			this.addWalls(this.floorPlan, params);

			// this.addItems(this.floorPlan, params);

			// console.log("START this.getWalls");
			this.walls = this.getWalls(this.walls, this.floorPlan);
			// console.log("END this.getWalls");
		} catch (e) {
			console.error(e);	
		}
	}

	beforeGeneratingSprites() {
		// leave blank
	}

	addFloors(floorPlan, params) {
		// leave blank
	}
	
	addWalls(floorPlan, params) {
		// leave blank
	}
	
	addItems(floorPlan, params) {
		// leave blank
	}

	addNextLevelExit() {
		this.drunkWalkExitPosition = this.findFirstPosition(this.floorPlan);
		this.addGameObject(new Exit(this.drunkWalkExitPosition.x, this.drunkWalkExitPosition.y, false));
		this.floorPlan = this.addFloorAroundPosition(this.drunkWalkExitPosition, this.floorPlan);
	}

	addPreviousLevelExit(heroStart) {
		this.caveExitPosition = heroStart.duplicate();
		this.caveExitPosition.x += gridCells(1);
		this.floorPlan = this.addFloorAroundPosition(this.caveExitPosition, this.floorPlan);
		this.addGameObject(new Exit(this.caveExitPosition.x, this.caveExitPosition.y, true));
	}

	addFloorAroundPosition(position, floorPlan) {

		for (let x = position.x - gridCells(1); x <= position.x + gridCells(1); x += gridCells(1)) {
			for (let y = position.y - gridCells(1); y <= position.y + gridCells(1); y += gridCells(1)) {
				floorPlan = this.addToFloorPlan(floorPlan, new Vector2(x, y));
			}
		}
		this.floorPlan.clearSize();
		return floorPlan;
	}

	addHero(heroStart) {
		this.hero = new Hero(heroStart.x, heroStart.y);
		this.addGameObject(this.hero);
	}

	teleportHero(position) {
		this.hero.destinationPosition = position.duplicate();
		this.hero.position = position.duplicate();
		events.emit("HERO_POSITION", this.hero.position);
	}

	addGameObject(gameObject) {
		this.gameObjects.push(gameObject);
		this.addChild(gameObject);
	}

	addFloor(floor) {
		this.floors.push(floor);
		this.addChild(floor);
	}

	addWall(wall) {
		this.wallSprites.push(wall);
		this.addChild(wall);
	}

	findSpotOnFloor(space) {
		return this.findRandomSpot(this.seed, this.floors, this.gameObjects, space);
	}

	findRandomSpot(seed, floors, gameObjects, space = new Vector2(gridCells(1), gridCells(1))) {
		let position = this.findRandomPosition(this.floorPlan, seed, floors, gameObjects, space);

		floors = [...floors, {
			position: position
		}];
		let loc = this.findRandomWallSpot(seed, floors, gameObjects, space);
		if (loc == undefined) {
			loc = this.findRandomSpot(seed, floors, gameObjects, space);
		}

		return loc;
	}

	findRandomWallSpot(seed, sprites, gameObjects, space = new Vector2(gridCells(1), gridCells(1))) {
		
		let start = Math.floor(seed() * sprites.length);
		let end = start - 1;

		let count = 0;
		let i = start;
		while (count < sprites.length) {
			count ++;
			i ++;
			let index = i % sprites.length;
			if (
				this.isPositionFree(
					sprites,
					gameObjects,
					sprites[index].position,
					space)
			) {
				return sprites[index].position.duplicate();
			}
		}
		return undefined;
	}

	isPositionFree(sprites, gameObjects, position, area) {
		let areaSprites = this.findAreaSprites(sprites, position, area);

		for (var i = areaSprites.length - 1; i >= 0; i--) {
			if (areaSprites[i] === undefined) {
				return false;
			}
			if (this.atGameObject(areaSprites[i], gameObjects)) {
				return false;
			}
		}
		return true;
	}

	findSprite(position, sprites) {
		for (var i = sprites.length - 1; i >= 0; i--) {
			if (sprites[i].position.matches(position)) {
				return sprites[i];
			}
		}
	}

	findAreaSprites(sprites, position, area) {
		let vectors = [];
		for (let x = 0; x < area.x; x += gridCells(1)) {
			for (let y = 0; y < area.y; y += gridCells(1)) {
				vectors.push(new Vector2(
					position.x + x,
					position.y + y
				));
			}
		}
		let areaSprites = [];
		for (var i = vectors.length - 1; i >= 0; i--) {
			areaSprites.push(this.findSprite(vectors[i], sprites));
		}
		return areaSprites;
	}

	atGameObject(obj, gameObjects) {

		// console.log(gameObjects);
		for (var i = gameObjects.length - 1; i >= 0; i--) {
			// console.log(gameObjects[i]);
			const maxX = new Vector2(
				gameObjects[i].position.x + gameObjects[i].size.x,
				gameObjects[i].position.y
			);
			// console.log("gameObjects[i].hasPosition(obj.position)", gameObjects[i].hasPosition(obj.position), gameObjects[i].position, obj.position);
			if (gameObjects[i].hasPosition(obj.position)
				|| maxX.matches(obj.position)) {
				return true;
			}
		}
		return false;
	}

	findFirstPosition(floorPlan) {
		for (let x = 0; x < floorPlan.width(); x ++) {
			for (let y = 0; y < floorPlan.height(); y ++) {
				if (floorPlan.get(x, y) >= 1) {
					return new Vector2(gridCells(x), gridCells(y));
				}
			}
		}
		return new Vector2(0, 0);
	}

	findRandomPosition(floorPlan, seed, sprites, gameObjects, space, depth = 0) {
		if (depth === 10) {
			return undefined;
		}
		// if (floorPlan.locations().length > 0) {
			let randomSpot = Math.floor(seed() * floorPlan.locations().length);
			let loc = floorPlan.locations()[randomSpot];
			let location = new Vector2(gridCells(loc.x), gridCells(loc.y));
			return location;
		// }
		// let max = floorPlan.width() * floorPlan.height();
		// let randomSpot = Math.floor(seed() * max);
		// let spot = randomSpot + 1;
		// while (spot !== randomSpot) {
		// 	let x = spot % floorPlan.height();
		// 	let y = Math.floor(spot / floorPlan.height());

		// 	if (floorPlan.get(x, y) >= 1) {
		// 		return new Vector2(gridCells(x), gridCells(y));
		// 	}
		// 	if (spot >= max) {
		// 		spot = 0;
		// 	} else {
		// 		spot ++;
		// 	}
		// }
		// return new Vector2(0, 0);
	}

	findHighestPosition(floorPlan) {
		let max = new Vector2(0, 0);
		for (let x = 0; x < floorPlan.width(); x ++) {
			for (let y = 0; y < floorPlan.height(); y ++) {
				if (floorPlan.get(x, y) > floorPlan.get(max.x, max.y)) {
					max = new Vector2(x, y);
				}
			}
		}
		
		return new Vector2(gridCells(max.x), gridCells(max.y));
	}

	addToFloorPlan(floorPlan, position) {
		// if (position.x < 0 || position.y < 0) return floorPlan;
		floorPlan.add(Math.floor(position.x / 16), Math.floor(position.y / 16), 1);
		return floorPlan;
	}

	getWalls(walls, floorPlan) {
		floorPlan.traverse({
			callback: (x, y, matrixValue) => {
				if (matrixValue == 0) {					
					walls.add(`${gridCells(x)}, ${gridCells(y)}`);
				}
			},
			padding: 2
		});

		return walls;
	}

	buildFloorPlan(query) {
		return WalkFactory.getFloorPlan(query);
	}

	getOrientation(x, y, floorPlan) {
		return OrientationFactory.getOrientation(x, y, floorPlan);
	}

	ready() {
		events.on("HERO_EXIT", this, (exit) => {
			if (exit.position.matches(this.caveExitPosition)) {
				events.emit("CHANGE_LEVEL", this.getHome())
			} else if (exit.position.matches(this.drunkWalkExitPosition)) {
				events.emit("CHANGE_LEVEL", this.getNextLevel());	
			}
		});
	}

	getHome() {
		return new CaveLevel1({
			heroPosition: new Vector2(gridCells(4), gridCells(4))
		});
	}

	getNextLevel() {
		return new DrunkardWalkLevel({
			seed: Math.seed(Math.random())
		});
	}
}