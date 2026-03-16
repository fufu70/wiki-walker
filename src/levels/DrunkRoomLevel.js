import {DrunkardWalkLevel} from './DrunkardWalkLevel.js';
import {Floor, RoomFloorFactory} from '../objects/room/Floor.js';
import {Wall, RoomWallFactory} from '../objects/room/Wall.js';
import {Trim, TrimFactory} from '../objects/room/Trim.js';
import {Vase} from '../objects/room/Vase.js';
import {Picture} from '../objects/room/Picture.js';
import {Television} from '../objects/room/Television.js';
import {Drawer} from '../objects/room/Drawer.js';
import {Bookshelf} from '../objects/room/Bookshelf.js';
import {Vector2} from "../Vector2.js";
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js';


export class DrunkRoomLevel extends DrunkardWalkLevel {


	addFloors(floorPlan, params) {
		if (window.renderIteratively) {
			this.addFloorIteratively(floorPlan, params);
		} else {
			this.addFloorCompletely(floorPlan, params);
		}
	}

	addFloorCompletely(floorPlan, params) {
		const floors = RoomFloorFactory.generate({
			floorPlan,
			seed: params.seed
		})
		for (var i = floors.length - 1; i >= 0; i--) {
			this.addFloor(floors[i]);
		}
	}

	addWalls(floorPlan, params) {
		if (window.renderIteratively) {
			this.addWallsIteratively(floorPlan, params);
		} else {
			this.addWallsCompletely(floorPlan, params);
		}
	}

	addWallsCompletely(floorPlan, params) {
		// console.log("START this.addTrimSprites")
		this.addTrimSprites(floorPlan);
		// console.log("END this.addTrimSprites")
		// console.log("START this.addWallSprites")
		this.addWallSprites(floorPlan, params);
	}

	addFloorIteratively(floorPlan, params) {
		if (!this.floorStyle) {
			this.floorStyle = new RoomFloorFactory().seedStyle(params.seed);
		}
		const iterativeParams = this.getIterativeParams();
		let param = {
			floorPlan: floorPlan,
			seed: params.seed,
			position: iterativeParams.position,
			size: iterativeParams.size,
			style: this.floorStyle
		};
		const floors = RoomFloorFactory.generate(param);
		for (var i = floors.length - 1; i >= 0; i--) {
			this.addFloor(floors[i]);
		}
	}

	addWallsIteratively(floorPlan, params) {
		const iterativeParams = this.getIterativeParams();
		this.addTrimSprites(floorPlan, iterativeParams.position, iterativeParams.size);
		
		this.addWallSprites(floorPlan, params, iterativeParams.position, iterativeParams.size);
	}


	addWallSprites(floorPlan, params, position, size) {
		if (!this.wallStyle) {
			this.wallStyle = new RoomWallFactory().seedStyle(params.seed);
		}
		let parm = {
			floorPlan: floorPlan,
			seed: params.seed,
			position: position,
			size: size,
			style: this.wallStyle
		};
		const walls =  RoomWallFactory.generate(parm);
		for (var i = walls.length - 1; i >= 0; i--) {
			this.addWall(walls[i]);
		}
	}

	addTrimSprites(floorPlan, position, size) {
		const trims =  TrimFactory.generate({
			floorPlan: floorPlan,
			position: position,
			size: size
		});
		for (var i = trims.length - 1; i >= 0; i--) {
			this.addTrim(trims[i]);
		}
	}

	addItems(floorPlan, params) {
		for (var i = 0; i < Math.max(params.rooms ?? 0, 1); i++) {
			// console.log("START this.addVases");
			this.addVases(floorPlan, params);
			// console.log("END this.addVases");
			// console.log("START this.addPictures");
			this.addPictures(params);
			// console.log("END this.addPictures");

			// console.log("START this.addTelevisions");
			this.addTelevisions(params);
			// console.log("END this.addTelevisions");
			// console.log("START this.addBookshelves");
			this.addBookshelves(params);
			// console.log("END this.addBookshelves");
			// console.log("START this.addDrawers");
			this.addDrawers(params);
			// console.log("END this.addDrawers");
		}
	}

	addVases(floorPlan, params) {
		const spaceAround = new Vector2(gridCells(3), gridCells(3));
		const spot = this.findSpotOnFloor(spaceAround);
		if (spot === undefined) return;
		spot.x += gridCells(1);
		spot.y += gridCells(1);
		this.addGameObject(new Vase(spot.x, spot.y, {
			seed: params.seed
		}));
	}

	addPictures(params) {
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects);
		if (spot === undefined) return;
		this.addGameObject(new Picture(spot.x, spot.y, undefined, params.seed, {
			url: "https://wikipedia.org/wiki/Special:Redirect/file/Adam-Olearius.jpg",
			caption: "Rock blasting at the large open-pit Twin Creeks gold mine in Nevada, United States. Note the size of the excavators for scale (foreground, left), and that the bottom of the mine is not visible."
		}));
	}

	addTelevisions(params) {
		const spaceAround = new Vector2(gridCells(2), gridCells(1));
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects, spaceAround);
		if (spot === undefined) return;
		this.addGameObject(new Television(spot.x, spot.y, undefined, params.seed));
	}

	addBookshelves(params) {
		const spaceAround = new Vector2(gridCells(4), gridCells(3));
		const spot = this.findSpotOnFloor(spaceAround);
		if (spot === undefined) return;
		spot.x += gridCells(1);
		spot.y += gridCells(1);
		this.addGameObject(new Bookshelf(spot.x, spot.y, undefined, params.seed));
	}

	addDrawers(params) {
		// console.log(this, this.seed, this.floors, this.gameObjects, gridCells(3));
		const spaceAround = new Vector2(gridCells(4), gridCells(3));
		const spot = this.findSpotOnFloor(spaceAround);
		if (spot === undefined) return;
		spot.x += gridCells(1);
		spot.y += gridCells(1);
		this.addGameObject(new Drawer(spot.x, spot.y, undefined, params.seed));
	}

	ready() {
		events.on("HERO_POSITION", this, heroPosition => {
			this.iterativeRender(heroPosition);
		});
		this.addFloors(this.floorPlan, this.params);
		this.addWalls(this.floorPlan, this.params);	
	}

	getIterativeParams() {
		const position = new Vector2(
			Math.round(window.renderPosition.x / GRID_SIZE),
			Math.round(window.renderPosition.y / GRID_SIZE)
		);
		const size = { 
			width: Math.round(320 / GRID_SIZE * 1.5), 
			height: Math.round(180 / GRID_SIZE * 1.5)
		};
		position.x -= Math.floor(size.width / 2);
		position.y -= Math.floor(size.height / 2);
		return {
			position: position,
			size: size
		};
	}

	iterativeRender(position) {
		if (!window.renderIteratively) {
			return;
		}

		if (!this.renderPosition) {
			this.renderPosition = position;
		}

		const rPos = new Vector2(
			Math.round(this.renderPosition.x / GRID_SIZE),
			Math.round(this.renderPosition.y / GRID_SIZE)
		);
		const pos = new Vector2(
			Math.round(position.x / GRID_SIZE),
			Math.round(position.y / GRID_SIZE)
		);
		const params = this.getIterativeParams();

		// only update when the render position is great enough
		if (Math.abs(rPos.x - pos.x) > params.size.width / 4
			||Math.abs(rPos.y - pos.y) > params.size.height / 4) { 
			this.addFloors(this.floorPlan, this.params);
			this.addWalls(this.floorPlan, this.params);	
			this.renderPosition = position;
		}
	}
}