import {getCircularReplacer} from '../console/Utils.js'

export class Storage {


	constructor(name) {
		this.name = name;
		this.fallbackCache = new Map();
	}

	has(key) {
		key = this.generateKey(key);
		return this.fallbackCache.has(key) || window.localStorage.getItem(key) !== null;
	}

	get(key) {
		key = this.generateKey(key);
		if (this.fallbackCache.has(key)) {
			return JSON.parse(this.fallbackCache.get(key));
		}
		return JSON.parse(window.localStorage.getItem(key));
	}

	set(key, value) {
		key = this.generateKey(key);
		value = JSON.stringify(value, getCircularReplacer());
		try {
			window.localStorage.setItem(key, value);	
		} catch (e) {
			console.error(e, key, value);
			this.fallbackCache.set(key, value)
		}
		
	}

	generateKey(key) {
		return this.name + ":" + key;
	}
}