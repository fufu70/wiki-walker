import {default as wtf} from 'wtf_wikipedia';
import {DrunkRoomLevel} from '../DrunkRoomLevel.js';
import {QuestionRod} from '../../objects/rod/QuestionRod.js';
import {NpcFactory} from '../../objects/npc/NpcFactory.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {Vector2} from "../../Vector2.js";
import {events} from '../../Events.js';
import {resources} from '../../Resources.js';
import {Exit} from '../../objects/exit/Exit.js';
import {Vase} from '../../objects/room/Vase.js';
import {Sign} from '../../objects/outdoors/Sign.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';
import {RoomPositionFactory} from '../../helpers/RoomPositionFactory.js';


export class WikiDisambiguationLevel extends DrunkRoomLevel {
	constructor(params={}) {
		try {
			super({
				...params,
				width: 5 * (params.links.length + 1),
				height: 5 * (params.links.length + 1),
				maxSteps: 10 * (((params.links.length + 1) ?? 0)+ 4),
				showNextLevel: false,
				showPreviousLevel: false,
				rotationChanges: (params.links.length + 1) ?? 0,
				rooms: params.links.length,
				roomParams: {
					stepSize: 1,
					maxSteps: 1,
					rotationChanges: 1,
				},
			});
		} catch (e) {
			console.error(e);
		}
	}

	beforeGeneratingSprites() {
		this.links = this.params.links;
		this.linkMap = new Map();
		this.linkExits= this.links.reduce((acc, curr) => {
			acc.set(curr.page, {})
			return acc;
		}, new Map());

		const getSize = (index) => { return this.getLinkSize(this.links, index)};
		const roomPositions = RoomPositionFactory.getRoomPositions(this.floorQuery.roomPositions, getSize, 0);

		roomPositions.forEach((position, index) => {
			// const spot = this.findSpotOnFloor(new Vector2(gridCells(1), gridCells(1)));
			// console.log("spot for " + this.links[i].page, spot);
			// this.placeLink(this.links[i], spot);


			position = new Vector2(gridCells(position.x), gridCells(position.y));
			this.placeLink(this.links[index], position);
		});
		this.floors = [];
	}
	
	addItems(floorPlan, params) {
		// leave blank
	}


	getLinkSize(list, index) {
		const room = list[index];
		let roomSize = new Vector2(4, 3);	
		if (Math.floor(this.params.seed() * 2) % 2 == 0) {
			roomSize = new Vector2(3, 1);	
		}
		return roomSize;
	}

	placeLink(link, loc) {
		if (loc == undefined) {
			console.error("CANNOT FIND LOCATION FOR", link)
			return;
		}
		
		loc.x -= gridCells(2);

		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);
		// while (!this.isPositionFree(this.floors, this.gameObjects, loc, new Vector2(gridCells(1), gridCells(1)))) {
			
		// 	this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);
		// }
		const signLoc = new Vector2(loc.x + gridCells(1), loc.y);
		this.floorPlan = this.addFloorAroundPosition(signLoc, this.floorPlan);
		
		const sign = new Sign(signLoc.x, signLoc.y, {
			content: [ {
				string: `The sign reads '${link.page}'`
			}]
		}, this.seed);
		this.addGameObject(sign);

		const exit = new Exit(loc.x, loc.y);
		this.linkExits.set(link.page, exit);
		this.addGameObject(exit);
	}

	ready() {
		super.ready();
		events.on("HERO_EXIT", this, (exit) => {
			const page = this.getPage(exit);
			if (!page) {
				return;
			}

			events.emit('SHOW_LOADING', {});
			WikiLevelFactory.request(page, (level) => {
				events.emit("CHANGE_LEVEL", level);
			}, (err) => {
				events.emit('END_LOADING', {});
				events.emit("SHOW_TEXTBOX", {
   					string: err
   				});
			});
		});

		events.emit('END_LOADING', {});
	}

	getPage(exit) {
		for (var i = 0; i < this.links.length; i++) {
			const linkExit = this.linkExits.get(this.links[i].page);
			if (linkExit && linkExit.position.matches(exit.position)) {
				return this.links[i].page
			}
		}
		return undefined;
	}
}