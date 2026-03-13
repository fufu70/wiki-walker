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
		// console.log("START this.addFloorSprites");
		this.addFloorCompletely(floorPlan, params);
		// console.log("END this.addFloorSprites");
	}

	addFloorCompletely(floorPlan, params) {
		const floors = RoomFloorFactory.generate({
			floorPlan,
			seed: params.seed
		})
		for (var i = floors.length - 1; i >= 0; i--) {
			this.addFloor(floors[i]);
		}

		// RoomFloorFactory.generateParallel({
		// 	floorPlan,
		// 	seed: params.seed
		// }).then(floors => {
		// 	for (var i = floors.length - 1; i >= 0; i--) {
		// 		this.addFloor(floors[i]);
		// 	}	
		// })
	}

	addFloorIteratively(floorPlan, params) {
		const position = new Vector2(window.renderPosition.x / 16, window.renderPosition.y / 16);
		position.x -= 10;
		position.y -= 10;
		const size = { width: 20, height: 20};
		let param = {
			floorPlan: floorPlan,
			seed: params.seed,
			position: position,
			size: size
		};
		const walls =  RoomFloorFactory.generate(param);
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

	addWallsIteratively(floorPlan, params) {
		const position = new Vector2(window.renderPosition.x / 16, window.renderPosition.y / 16);
		position.x -= 10;
		position.y -= 10;
		const size = { width: 20, height: 20};
		this.trim
		this.addTrimSprites(floorPlan, position, size);
		// console.log("END this.addTrimSprites")
		// console.log("START this.addWallSprites")
		this.addWallSprites(floorPlan, params, position, size);
	}


	addWallSprites(floorPlan, params, position, size) {
		let parm = {
			floorPlan: floorPlan,
			seed: params.seed,
			position: position,
			size: size
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
}