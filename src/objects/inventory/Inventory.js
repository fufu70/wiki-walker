import {HudGameObject} from "../../HudGameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Typewriter} from '../../helpers/text/Typewriter.js';
import {InventoryStorage} from './InventoryStorage.js';


export class Inventory extends HudGameObject {
	
	items = [];

	constructor() {
		super({
			position: new Vector2(0, 1)
		});
		this.drawLayer = "HUD";
		this.storage = new InventoryStorage();

		this.items = this.storage.getItems();
		// storage.get()
		this.typewriter = new Typewriter({});

		this.renderInventory();
	}

	ready() {
		events.on("HERO_PICKS_UP_ITEM", this, data => {
			this.items = this.storage.addItem(data);
			this.renderInventory();
		});

		events.on("HERO_LOSES_ITEM", this, data => {
			this.items = this.storage.removeItem(data);
			this.renderInventory();
		});
	}

	renderInventory() {
		// remove the stale drawings
		this.children.forEach(child => child.destroy());

		// draw fresh from the latest version of the list
		let position = 0;
		this.items.forEach((item, index) => {

			const sprite = new Sprite({
				resource: item.image,
				position: new Vector2(position, 0)
			});
			if (item.count > 1) {
				this.addCountSprite(position, item);
			}
			
			position += 12;
			this.addChild(sprite);
		})
	}

	addCountSprite(position, item) {
		let cursorX = position + 12
		let cursorY = 6;
		let currentShowingIndex = 0;
		const words = this.typewriter.generateWords(item.count + "");
		words.forEach(word => {
			word.chars.forEach(char => {
				const {sprite, width} = char;

				const withCharOffset = cursorX - 5;
				const wordSprite = sprite.clone();
				wordSprite.position = new Vector2(withCharOffset, cursorY);
				this.addChild(wordSprite);
				cursorX += width;

				// plus 1px between character
				cursorX += 1;

				// Uptick
				currentShowingIndex += 1;
			});
			// Move the cursor over
			cursorX += 3;
		});
	}
}