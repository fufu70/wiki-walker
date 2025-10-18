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
				rooms: 1,
				roomParams: {
					stepSize: 3,
					maxSteps: 10,
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
		this.linkExit= this.links.reduce((acc, curr) => {
			acc.set(curr.page, {})
			return acc;
		}, new Map());

		for (var i = 0; i < this.links.length; i++) {
			this.addFloors(this.floorPlan, this.params);
			const spot = this.findSpotOnFloor(new Vector2(gridCells(1), gridCells(1)));
			console.log("spot for " + this.links[i].page, spot);
			this.placeLink(this.links[i], spot);
			this.floors = [];
		}
	}
	
	addItems(floorPlan, params) {
		// leave blank
	}

	placeLink(link, loc) {
		if (loc == undefined) {
			console.log("CANNOT FIND LOCATION FOR", link)
			return;
		}

		const exitLoc = new Vector2(loc.x, loc.y + gridCells(2));
		const signLoc = new Vector2(loc.x + gridCells(1), loc.y + gridCells(2));

		this.floorPlan = this.addFloorAroundPosition(exitLoc, this.floorPlan);
		this.floorPlan = this.addFloorAroundPosition(signLoc, this.floorPlan);
		
		const sign = new Sign(signLoc.x, signLoc.y, {
			content: [ {
				string: `The sign reads '${link.page}'`
			}]
		}, this.seed);
		this.addGameObject(sign);

		const exit = new Exit(exitLoc.x, exitLoc.y);
		this.linkExit.set(link.page, exit);
		this.addGameObject(exit);
	}

	ready() {
		super.ready();
		events.on("HERO_EXIT", this, (exit) => {
			for (var i = 0; i < this.links.length; i++) {
				if (this.linkExit.get(this.links[i].page).position.matches(exit.position)) {
					events.emit('SHOW_LOADING', {});
					WikiLevelFactory.request(this.links[i].page, (level) => {
						events.emit("CHANGE_LEVEL", level);
					}, (err) => {
						events.emit('END_LOADING', {});
						events.emit("SHOW_TEXTBOX", {
		   					string: err
		   				});
					});
				}
			}
		});

		events.emit('END_LOADING', {});

		console.log("FLOOR", this.floorPlan, this.floorPlan.toString().replaceAll("0", " "));		
	}
}