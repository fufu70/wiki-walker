import {default as wtf} from 'wtf_wikipedia';
import {DrunkOutdoorLevel} from '.././DrunkOutdoorLevel.js';
import {QuestionRod} from '../../objects/rod/QuestionRod.js';
import {NpcFactory} from '../../objects/npc/NpcFactory.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {Vector2} from "../../Vector2.js";
import {events} from '../../Events.js';
import {resources} from '../../Resources.js';
import {Vase} from '../../objects/room/Vase.js';
import {Sign} from '../../objects/outdoors/Sign.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';

export class WikiSearchLevel extends DrunkOutdoorLevel {
	constructor(params={}) {

		try {
			super({
				...params,
				showPreviousLevel: false,
				showNextLevel: false,
			});
			setTimeout(() => {
				events.emit("HERO_REQUESTS_ACTION", this.npc);
			}, 1000);
		} catch (e) {
			console.error(e);
		}
	}

	beforeGeneratingSprites() {
		this.question = "Let's try and find what you're looking for. What do you want to know?";
		this.placeNpc(this.params);
	}

	placeNpc(params) {
		console.log("FLOOR", this.floorPlan.toString().replaceAll("0", " "));
		const loc = this.heroStart.duplicate();
		loc.x += gridCells(1);
		loc.y += gridCells(-2);


		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);
		this.npc = NpcFactory.getWizard(loc, {
			content: this.getContent(params)
		}, this.seed);
		this.addGameObject(this.npc);

		this.sign = new Sign(loc.x - gridCells(1), loc.y, {
			content: [ {
				string: "Go ahead! Ask the wizard whatever you want to know!"
			}]
		}, this.seed);
		this.addGameObject(this.sign);


		const spot = new Vector2(loc.x + gridCells(2), loc.y + gridCells(2));
		this.floorPlan = this.addFloorAroundPosition(spot, this.floorPlan);
		this.addGameObject(new Vase(spot.x, spot.y, undefined, params.seed));
	}


	getContent(params) {
		return [
			{
				string: this.question,
				eventType: "TEXT_INPUT",
				requires: [`INTRODUCED_LEVEL WIKI_SEARCH`]
			},
			{
				string: `Hi THere! Welcome to WikiCrawler. Come to me and tell me what you want to know from Wikipedia!`,
				requires: [],
				addsFlag: `INTRODUCED_LEVEL WIKI_SEARCH`
			},
		];
	}

	ready() {
		super.ready();

		const searchAnswer = events.on("SUBMIT_INPUT_TEXT", this, ({config, text}) => {

			if (config.string === this.question) {
				this.searchWiki(text);
				// events.off(searchAnswer);	
			}
		});
	}

	searchWiki(text) {
		events.emit('SHOW_LOADING', {});
		WikiLevelFactory.request(text, (level) => {
			events.emit("CHANGE_LEVEL", level );
		}, (err) => {
			events.emit('END_LOADING', {});
			events.emit("SHOW_TEXTBOX", {
				string: err
			});
		});
	}

	getDisambiguationLevel(doc) {

	}

	getPageLevel(doc) {

	}

	getNextLevel() {
		return undefined;
	}

	getHome() {
		return undefined;
	}
}