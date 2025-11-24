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
import {SUPPORTED_CHARACTERS} from '../textbox/spriteFontMap.js';
import {SpriteTextString} from '../textbox/SpriteTextString.js'
import {storyFlags} from '../../StoryFlags.js';
import {TextInput} from '../input/TextInput.js';
import {SelectInput} from '../input/SelectInput.js';
import {LoadingScreen} from '../loading/LoadingScreen.js';

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

// 		setTimeout(() => {
// events.emit('SHOW_TEXTBOX', {
// 	portraitFrame: 0,
// 	addFlags: null,
// 	string: `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?`
// });
// 		});
		setTimeout(() => {
			events.emit('SHOW_TEXTBOX', {
				portraitFrame: 0,
				addFlags: null,
				string: `SUPPORTED_CHARACTERS TEST: ${SUPPORTED_CHARACTERS.split("").join(" ")}`
			});
		});

		// setTimeout(() => {
		// 	events.emit("SELECT_INPUT", {
		// 		string: "Rock blasting at the large open-pit Twin Creeks gold mine in Nevada, United States. View image?",
		// 		options: ["Steve", "john", "Red", "Bob", "Matt", "Jerry", "Terry",
		// 			"Lteve", "Eohn", "Ted", "Uob", "Hatt", "Ferry", "ATerry"]
		// 	});
		// })

		// setTimeout(() => {
		// 	events.emit("SHOW_IMAGE", {
		// 		url: "https://en.wikipedia.org/wiki/File:Tagebau_Garzweiler_bei_Otzerath_Schaufelradbagger_Januar2008.ogv"
		// 	})
		// })

		// setTimeout(() => {
		// 	events.emit("SHOW_VIDEO", {
		// 		urls: [ "https://wikipedia.org/wiki/Special:Redirect/file/Night_of_the_Living_Dead_(1968).webm" ]
		// 	})
		// })

		// setTimeout(() => {
		// 	events.emit("SHOW_TABLE", {
		// 		table: [
		// 			{test: "a", change: "b"},
		// 			{test: "c", change: "d"}
		// 		]
		// 	})
		// })

		// setTimeout(() => {
		// 	events.emit('SHOW_LOADING', {});
		// });

		// setTimeout(() => {
		// 	events.emit('END_LOADING', {});
		// }, 300);
	}

	setLevel(newLevelInstance) {
		if (this.level) {
			this.level.destroy();
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