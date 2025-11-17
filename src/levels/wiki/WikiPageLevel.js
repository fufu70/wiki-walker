import {Hero} from '../../objects/hero/Hero.js';
import {default as wtf} from 'wtf_wikipedia';
import {DrunkRoomLevel} from '../DrunkRoomLevel.js';
import {NpcFactory} from '../../objects/npc/NpcFactory.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {Vector2} from "../../Vector2.js";
import {events} from '../../Events.js';
import {resources} from '../../Resources.js';
import {Exit} from '../../objects/exit/Exit.js';
import {Vase} from '../../objects/room/Vase.js';
import {Bookshelf} from '../../objects/room/Bookshelf.js';
import {Drawer} from '../../objects/room/Drawer.js';
import {Picture} from '../../objects/room/Picture.js';
import {Television} from '../../objects/room/Television.js';
import {Sign} from '../../objects/outdoors/Sign.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';
import {RoomPositionFactory} from '../../helpers/RoomPositionFactory.js';


export class WikiPageLevel extends DrunkRoomLevel {
	constructor(params={}) {
		try {
			super({
				...params,
				width: 20 * params.sections.length,
				height: 20 * params.sections.length,
				maxSteps: 35 * params.sections.length,
				showNextLevel: false,
				showPreviousLevel: false,
				rotationChanges: params.sections.length ?? 0,
				rooms: params.sections.length,
				roomParams: {
					stepSize: 5,
					maxSteps: 1,
					rotationChanges: 1,
				},
			});
		} catch (e) {
			console.error(e);
		}
	}

	beforeGeneratingSprites() {
		this.placeRooms(this.params);
	}

	addHero(heroStart) {
		heroStart = this.floorQuery.startingPosition.duplicate();
		const hero = new Hero(gridCells(heroStart.x), gridCells(heroStart.y));
		this.addGameObject(hero);
	}

	placeRooms(params) {
		// console.log("FLOOR", this.floorPlan.toString().replaceAll("0", " "));
		this.roomExits = new Map();
		this.rooms = params.sections;
		const getSize = (index) => { return this.getRoomSize(this.rooms, index)};
		const roomPositions = RoomPositionFactory.getRoomPositions(this.floorQuery.roomPositions, getSize);
		console.log("ROOMS", params.sections);
		console.log("FLOOR QUERY ROOM POSITIONS", JSON.stringify(this.floorQuery.roomPositions));
		console.log("ROOM POSITIONS", JSON.stringify(roomPositions));
		console.log("HERO_START", this.heroStart, this.floorPlan, this.findFirstPosition(this.floorPlan));
		console.log("LEVEL", this);


		roomPositions.forEach((position, index) => {
			position = new Vector2(gridCells(position.x), gridCells(position.y));
			const section = params.sections[index];
			this.placeRoom(params, section, position);
		});


		const loc = this.floorQuery.startingPosition.duplicate();
		loc.x += gridCells(2);
		loc.y += gridCells(-2);
		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);
		const spot = new Vector2(loc.x + gridCells(2), loc.y + gridCells(2));
		this.floorPlan = this.addFloorAroundPosition(spot, this.floorPlan);
	}

	getRoomSize(list, index) {
		const room = list[index];
		const roomSize = new Vector2(1, 1);

		let shelfCount = 0;
		room.paragraphs.filter(paragraph => {
			return paragraph.length > 0;
		}).forEach(paragraph => {
			roomSize.y += 2;
			shelfCount ++;
		});

		room.tables.filter(table => {
			return table !== undefined || table !== null;
		}).forEach(table => {
			roomSize.y += 2;
			shelfCount ++;
		});

		if (shelfCount > 0) {
			roomSize.x += 2;
		}
		
		if (room.links.length > 0) {
			roomSize.x += 1
		}
		return roomSize;
	}

	placeRoom(params, room, loc) {
		console.log("PLACE ROOM", room, loc)
		if (loc == undefined) {
			console.log("CANNOT FIND LOCATION FOR", room)
			return;
		}

		loc.y += gridCells(1);

		const signLoc    = new Vector2(loc.x + gridCells(-1), loc.y + gridCells(0));
		const shelfLoc   = new Vector2(loc.x + gridCells(0), loc.y + gridCells(0));
		const paddingLoc = new Vector2(loc.x + gridCells(1), loc.y + gridCells(0));
		const exitLoc    = new Vector2(loc.x + gridCells(2), loc.y + gridCells(0));

		this.floorPlan = this.addFloorAroundPosition(exitLoc, this.floorPlan);
		this.floorPlan = this.addFloorAroundPosition(shelfLoc, this.floorPlan);
		this.floorPlan = this.addFloorAroundPosition(paddingLoc, this.floorPlan);
		this.floorPlan = this.addFloorAroundPosition(signLoc, this.floorPlan);
		
		const sign = new Sign(signLoc.x, signLoc.y, {
			content: [ {
				string: room.title.length === 0 ? params.title : room.title
			}]
		}, this.seed);
		this.addGameObject(sign);

		let shelfCount = 0;
		room.paragraphs.filter(paragraph => {
			return paragraph.length > 0;
		}).forEach(paragraph => {
			const shelfLoc = new Vector2(loc.x + gridCells(0), loc.y + gridCells(shelfCount * 2));
			const paddingLoc = new Vector2(loc.x + gridCells(1), loc.y + gridCells(shelfCount * 2));
			this.floorPlan = this.addFloorAroundPosition(shelfLoc, this.floorPlan);
			this.floorPlan = this.addFloorAroundPosition(paddingLoc, this.floorPlan);

			const bookshelf = new Bookshelf(shelfLoc.x, shelfLoc.y, undefined, params.seed, {
				content: [
					{
						string: paragraph
					}
				]
			});
			this.addGameObject(bookshelf);
			shelfCount ++;
		});

		room.tables.filter(table => {
			return table !== undefined || table !== null;
		}).forEach(table => {
			const shelfLoc = new Vector2(loc.x + gridCells(0), loc.y + gridCells(shelfCount * 2));
			const paddingLoc = new Vector2(loc.x + gridCells(1), loc.y + gridCells(shelfCount * 2));
			this.floorPlan = this.addFloorAroundPosition(shelfLoc, this.floorPlan);
			this.floorPlan = this.addFloorAroundPosition(paddingLoc, this.floorPlan);

			const drawer = new Drawer(shelfLoc.x, shelfLoc.y, undefined, params.seed, {
				table: table
			});
			this.addGameObject(drawer);
			shelfCount ++;
		});
		
		if (room.links.length > 0) {
			const exit = new Exit(exitLoc.x, exitLoc.y);
			this.addGameObject(exit);
			this.roomExits.set(room.title, exit);
		}
	}

	
	addItems(floorPlan, params) {
		params.images.forEach((image, index) => {
			this.placePicture(image, params);
		});

		params.videos.forEach((video, index) => {
			this.placeTelevision(video, params);
		});
	}

	placePicture(image, params) {
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects);
		if (spot === undefined) return;
		this.addGameObject(new Picture(spot.x, spot.y, undefined, params.seed, {
			url: image.url,
			caption: image.caption
		}));
	}

	placeTelevision(video, params) {
		const spaceAround = new Vector2(gridCells(2), gridCells(1));
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects, spaceAround);
		if (spot === undefined) return;
		this.addGameObject(new Television(spot.x, spot.y, undefined, params.seed, {
			urls: video.urls,
			caption: video.caption
		}));
	}

	QUESTION = "Let's try and find what you're looking for. What do you want to know?";

	getContent(params) {
		return [
			{
				string: QUESTION,
				eventType: "TEXT_INPUT",
				requires: [`INTRODUCED_LEVEL WIKI_SEARCH`]
			},
			{
				string: `Hi THere! What are you doing here? Come and tell me what you want to know!`,
				requires: [],
				addsFlag: `INTRODUCED_LEVEL WIKI_SEARCH`
			},
		];
	}

	ready() {
		super.ready();
		events.on("HERO_EXIT", this, (exit) => {
			events.emit('SHOW_LOADING', {});
			for (var i = 0; i < this.rooms.length; i++) {
				let roomExit = this.roomExits.get(this.rooms[i].title);
				if (roomExit != undefined && roomExit.position.matches(exit.position)) {
					events.emit("CHANGE_LEVEL", (new WikiLevelFactory()).getDisambiguationLevel({
						links: this.rooms[i].links
					}));
				}
			}
		});

		events.emit('END_LOADING', {});
	}
}