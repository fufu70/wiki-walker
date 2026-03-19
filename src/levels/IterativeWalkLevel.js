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


export class IterativeWalkLevel extends DrunkardWalkLevel {

	constructor(params) {
		super(params);
	}

	beforeGeneratingSprites() {
		this.floorMax = 510;
		this.floorIndex = 0;
		this.wallIndex = 0;
		this.wallMax = 120;
		this.trimIndex = 0;
		this.trimMax = 150;
		this.renderSize = { 
			width: Math.round(320 / GRID_SIZE * 1.5), 
			height: Math.round(180 / GRID_SIZE * 1.5)
		};
	}

	addCloneObject(obj, objs, index, max) {
		if (objs.length < max) {
			objs.push(obj);
			this.addChild(obj);	
			return index;
		}

		if (index >= max - 1) {
			index = 0;
		}

		if (objs[index].clone != undefined) {
			objs[index].clone(obj);	
		}

		index ++;
		return index;
	}

	addFloor(floor) {
		this.floorIndex = this.addCloneObject(
			floor, 
			this.floors, 
			this.floorIndex, 
			this.floorMax
		);
	}

	addWall(wall) {
		this.wallIndex = this.addCloneObject(
			wall, 
			this.wallSprites, 
			this.wallIndex, 
			this.wallMax
		);
	}

	addTrim(trim) {
		this.trimIndex = this.addCloneObject(
			trim, 
			this.trimSprites, 
			this.trimIndex, 
			this.trimMax
		);
	}

	addFloors(floorPlan, params) {
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

	addWalls(floorPlan, params) {
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
		position.x -= Math.floor(this.renderSize.width / 2);
		position.y -= Math.floor(this.renderSize.height / 2);
		return {
			position: position,
			size: this.renderSize
		};
	}

	iterativeRender(position) {
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