import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Inventory} from '../inventory/Inventory.js';
import {Camera} from '../Camera.js'
import {SpriteTextString} from '../textbox/SpriteTextString.js'
import {storyFlags} from '../../StoryFlags.js';
import {TextInput} from '../input/TextInput.js';
import {SelectInput} from '../input/SelectInput.js';
import {LoadingScreen} from '../loading/LoadingScreen.js';
import * as test from './TestMain.js';

export class Main extends GameObject {
	constructor() {
		super({});
		this.level = null;
		this.input = new Input();
		this.camera = new Camera();
	}

	ready() {
		const inventory = new Inventory();		
		this.addChild(inventory);

		events.on("HERO_REQUESTS_ACTION", this, (withObject) => {

			if (typeof withObject.getContent !== "function") {
				return;
			}

			const content = withObject.getContent();

			console.log(content);
			if (!content) {
				return;
			}

			if (!content.eventType) {
				events.emit("SHOW_TEXTBOX", content);
			} else {
				events.emit(content.eventType, content);
			}
		});

		events.on("SHOW_TEXTBOX", this, (content) => {

			// Potentially add a story flag
 
			if (content.addFlags) {
				console.log("Add FLAG", content.addFlags);
				storyFlags.add(content.addFlags);
			}

			let textbox = new SpriteTextString({
				portraitFrame: content.portraitFrame,
				string: content.string
			});

			this.addChild(textbox);

			const endingSub = events.on("END_TEXT_BOX", this, () => {
				textbox.destroy();
				textbox = null;
				events.off(endingSub);
				if (typeof content.onEnd === "function") {
					content.onEnd();
				}
			});
		});


		events.on("SHOW_IMAGE", this, (content) => {

			// Potentially add a story flag
 			if (window.ImageViewer === undefined) {
 				events.emit("SHOW_TEXTBOX", {
 					string: "Looks like images are not supported right now :("
 				});
 				return;
 			}
			window.ImageViewer.view(content.url);
		});

		events.on("SHOW_VIDEO", this, (content) => {

			// Potentially add a story flag
 			if (window.VideoViewer === undefined) {
 				events.emit("SHOW_TEXTBOX", {
 					string: "Looks like videos are not supported right now :("
 				});
 				return;
 			}
			window.VideoViewer.view(content.urls);
		});


		events.on("SHOW_TABLE", this, (content) => {
			console.log("TABLE CONTENT", content);
			// Potentially add a story flag
 			if (window.TableViewer === undefined) {
 				events.emit("SHOW_TEXTBOX", {
 					string: "Looks like tables are not supported right now :("
 				});
 				return;
 			}
			window.TableViewer.view(content.table);
		});

		events.on("CHANGE_LEVEL", this, newLevelInstance => {
			this.setLevel(newLevelInstance);
		});

		events.on("TEXT_INPUT", this, config => {
			// const textInput = new SelectInput(config);
			let textInput = new TextInput(config);
			this.addChild(textInput);

			const endingDecideSub = events.on("DECIDE_INPUT_TEXT", this, (text) => {
				events.emit("SUBMIT_INPUT_TEXT", {
					config: config,
					text: text
				});
				textInput.destroy();
				textInput = null;
				events.off(endingDecideSub);
				events.off(endingCancelSub);
			});

			const endingCancelSub = events.on("CANCEL_INPUT_TEXT", this, () => {
				textInput.destroy();
				textInput = null;
				events.off(endingDecideSub);
				events.off(endingCancelSub);
			});
		});

		events.on("SHOW_LOADING", this, config => {
			// const textInput = new SelectInput(config);
			this.loadingScreen = new LoadingScreen(config);
			this.addChild(this.loadingScreen);
		});

		events.on("END_LOADING", this, config => {
			// const textInput = new SelectInput(config);
			if (this.loadingScreen !== null) {
				this.loadingScreen.finish(() => {
					this.loadingScreen?.destroy();
					this.loadingScreen = null;		
				})
			}
		});


		events.on("SELECT_INPUT", this, config => {
			let textInput = new SelectInput(config);
			this.addChild(textInput);

			const endingDecideSub = events.on("DECIDE_INPUT_TEXT", this, (text) => {
				events.emit("SUBMIT_INPUT_TEXT", {
					config: config,
					text: text
				});
				textInput.destroy();
				textInput = null;
				events.off(endingDecideSub);
				events.off(endingCancelSub);
			});

			const endingCancelSub = events.on("CANCEL_INPUT_TEXT", this, () => {
				textInput.destroy();
				textInput = null;
				events.off(endingDecideSub);
				events.off(endingCancelSub);
			});
		});
	}

	setLevel(newLevelInstance) {
		if (this.level) {
			this.level.destroy();
			this.level = undefined;
		}

		this.level = newLevelInstance;
		this.addChild(this.level);
	}

	drawBackground(ctx) {
		this.level?.background.drawImage(ctx, 0, 0);
	}

	drawObjects(ctx) {
		this.children.forEach(child => {
			if (child.drawLayer !== "HUD") {
				child.draw(ctx, 0,0);
			}
		});
	}

	drawForeground(ctx) {
		this.children.forEach(child => {
			if (child.drawLayer === "HUD") {
				child.draw(ctx, 0,0);
			}
		})

		// this.inventory.draw(ctx, this.inventory.position.x, this.inventory.position.y);
		// this.textbox.draw(ctx, 0, 0);
	}
}