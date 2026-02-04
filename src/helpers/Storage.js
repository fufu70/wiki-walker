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
		let value = undefined;
		if (this.fallbackCache.has(key)) {
			value = this.fallbackCache.get(key);
		} else {
			value = window.localStorage.getItem(key);
		}
		try {
			return JSON.parse(value);
		} catch {
			return undefined;
		}
	}

	set(key, value) {
		key = this.generateKey(key);
		value = JSON.stringify(value, getCircularReplacer());
		try {
			window.localStorage.setItem(key, value);	
		} catch (e) {
			// console.error(e, key, value);
			this.fallbackCache.set(key, value)
		}
		
	}

	generateKey(key) {
		return this.name + ":" + key;
	}
}