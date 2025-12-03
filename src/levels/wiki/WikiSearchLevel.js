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
import {Campfire} from '../../objects/outdoors/Campfire.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';
import {Exit} from '../../objects/exit/Exit.js';

export class WikiSearchLevel extends DrunkOutdoorLevel {
	constructor(params={}) {

		try {
			super({
				...params,
				showPreviousLevel: false,
				showNextLevel: false,
			});
			setTimeout(() => {
				// events.emit("HERO_REQUESTS_ACTION", this.npc);
				// this.searchWiki("Bo")
				// this.searchWiki("Nasolacrimal duct")
				// this.searchWiki("Ergodic literature")
				// this.searchWiki("Nasal concha")
				// this.searchWiki("test")
				// this.searchWiki("The Twilight Zone") // multiple rooms are being rendered on top of one another
				// this.searchWiki("List of pending United States Supreme Court cases") // good test for viewing a large table.
			}, 300);
		} catch (e) {
			console.error(e);
		}
	}

	beforeGeneratingSprites() {
		this.question = "Let's try and find what you're looking for. What do you want to know?";
		this.languageQuestion = "Choose the language you'd like to search in.";
		// console.log("FLOOR", this.floorPlan.toString().replaceAll("0", " "));
		this.placeNpc(this.params);
		this.placeRandom(this.params);
		// this.placeLanguage(this.params);
		this.placeCampfire(this.params);
	}

	placeNpc(params) {
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
	}

	placeRandom(params) {
		const loc = this.heroStart.duplicate();
		loc.x += gridCells(2);
		loc.y += gridCells(2);
		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);

		const exit = new Exit(loc.x, loc.y);
		this.addGameObject(exit);
	}

	placeLanguage(params) {
		const loc = this.heroStart.duplicate();
		loc.x += gridCells(-2);
		loc.y += gridCells( 1);
		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);

		const vase = new Vase(loc.x, loc.y, {
			seed: params.seed,
			content: [{
				eventType: "SELECT_INPUT",
				string: this.languageQuestion,
				uuid: this.uuid,
				selectedFunc: () => WikiLevelFactory.getSelectedLanguage(),
				options: WikiLevelFactory.getLanguages()
			}]
		});
		this.addGameObject(vase);
	}

	placeCampfire(params) {

		const loc = this.heroStart.duplicate();
		loc.x += gridCells(-1);
		loc.y += gridCells(1);
		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);

		const vase = new Campfire(loc.x, loc.y, {
			seed: params.seed,
			content: [{
				eventType: "SELECT_INPUT",
				string: this.languageQuestion,
				uuid: this.uuid,
				selectedFunc: () => WikiLevelFactory.getSelectedLanguage(),
				options: WikiLevelFactory.getLanguages()
			}]
		});
		this.addGameObject(vase);
	}

	getContent(params) {
		return [
			{
				string: this.question,
				eventType: "TEXT_INPUT",
				requires: [`INTRODUCED_LEVEL WIKI_SEARCH`]
			},
			{
				string: `Hi THere! Welcome to WikiWalker. Walk down the stairs to a random article or come to me and tell me what you want to know from Wikipedia! The Vase let's you pick a different language to search from.`,
				requires: [],
				addsFlag: `INTRODUCED_LEVEL WIKI_SEARCH`
			},
		];
	}

	ready() {
		super.ready();

		events.on("SUBMIT_INPUT_TEXT", this, ({config, text}) => {

			if (config.string === this.question) {
				this.searchWiki(text);
			}

			if (config.string === this.languageQuestion) {
				this.updateLanguage(text);
			}
		});

		events.on("HERO_EXIT", this, (exit) => {
			events.emit('SHOW_LOADING', {});
			WikiLevelFactory.random((level) => {
				events.emit("CHANGE_LEVEL", level );
			}, (err) => {
				events.emit('END_LOADING', {});
				events.emit("SHOW_TEXTBOX", {
					string: err
				});
			});
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

	updateLanguage(text) {
		WikiLevelFactory.updateLanguage(text);
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