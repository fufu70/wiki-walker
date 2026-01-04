import {Hero} from '../../objects/hero/Hero.js';
import {default as wtf} from 'wtf_wikipedia';
import {DrunkRoomLevel} from '../DrunkRoomLevel.js';
import {NpcFactory} from '../../objects/npc/NpcFactory.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {Vector2} from "../../Vector2.js";
import {events} from '../../Events.js';
import {resources} from '../../Resources.js';
import {Exit, UP_STAIRS} from '../../objects/exit/Exit.js';
import {Vase} from '../../objects/room/Vase.js';
import {Bookshelf} from '../../objects/room/Bookshelf.js';
import {Drawer} from '../../objects/room/Drawer.js';
import {Picture} from '../../objects/room/Picture.js';
import {Television} from '../../objects/room/Television.js';
import {Sign} from '../../objects/outdoors/Sign.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';
import {RoomPositionFactory} from '../../helpers/RoomPositionFactory.js';

export class WikiRoomLevel extends DrunkRoomLevel {

	constructor(wikiParams={}) {
		try {
			super(wikiParams);
		} catch (e) {
			console.error(e);
		}
	}

	updateLevelParams(roomLevelParams) {
		this.levelParams = roomLevelParams;
	}

	addHero(heroStart) {
		heroStart = this.floorQuery.startingPosition.duplicate();
		this.hero = new Hero(gridCells(heroStart.x), gridCells(heroStart.y));
		this.addGameObject(this.hero);

		const stairsUpLoc = new Vector2(gridCells(heroStart.x + 1), gridCells(heroStart.y));
		this.floorPlan = this.addFloorAroundPosition(stairsUpLoc, this.floorPlan);
		const stairsUp = new Exit(stairsUpLoc.x, stairsUpLoc.y, UP_STAIRS);
		this.addGameObject(stairsUp);
	}


	getRoomPositions(rooms, floorRoomPositions) {
		// Add the hero position to the list of rooms
		rooms = [{hero: true}].concat(rooms);
		floorRoomPositions = [{...this.floorQuery.startingPosition}].concat(floorRoomPositions);
		const getSize = (index) => { return this.getRoomSize(rooms, index)};
		const roomPositions = RoomPositionFactory.getRoomPositions(floorRoomPositions, getSize);
		// remove the first index to pop off the hero rooms
		roomPositions.shift();
		return roomPositions;
	}

	getRoomSize(list, index) {
		return new Vector2(1, 1);
	}

	ready() {
		super.ready();

		events.on("HERO_EXIT_UP", this, (exit) => {
			events.emit("CHANGE_LEVEL", WikiLevelFactory.loadPop(
				WikiLevelFactory.popLevel()
			));
		});

		events.on("HERO_POSITION", this, (position) => {
			WikiLevelFactory.updateLastPosition(this.levelParams, position)
		});

		events.emit('END_LOADING', {});
	}
}