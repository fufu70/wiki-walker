import {Storage} from '../../helpers/Storage.js';

export class InventoryStorage extends Storage {

	constructor() {
		super("Inventory");
		this.items = JSON.parse(this.get("items"));
	}

	get(key) {
		let value = super.get(key);
		if (!value) {
			value = [];
		}
		return value;
	}

	set(key, value) {
		super.set(key, value);
	}

	getItems() {
		return this.items.map(a => {
			const img = new Image();
			img.src = a.src;

			return {
				id: a.id,
				image: {
					image: img,
					isLoaded: true
				},
				count: a.count
			}
		});
	}

	saveItems() {
		this.set("items", JSON.stringify(this.items));
	}

	addItem(data) {
		const item = this.findItem(data);
		if (item === undefined) {
			this.items.push({
				id: crypto.randomUUID(),
				src: data.image.image.src,
				count: 1
			});
		} else {
			this.incrementCount(item);
		}
		this.saveItems();
		return this.getItems();
	}

	removeItem(data) {
		const item = this.findItem(data);
		this.removeFromInventory(item);
		this.saveItems();
		return this.getItems();
	}

	findItem(data) {
		return this.items.find(item => data.image.image.src === item.src);
	}

	incrementCount(item) {
		item.count ++;
	}

	decrementCount(item) {
		item.count --;
	}

	removeFromInventory(item) {
		if (item.count == 1) {
			this.items = this.items.filter(it => it.id !== item.id);
		} else {
			this.decrementCount(item);
		}
	}
}