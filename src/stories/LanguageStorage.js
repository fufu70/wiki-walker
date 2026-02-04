import {Storage} from '../helpers/Storage.js';

export class LanguageStorage extends Storage {

	constructor() {
		super("Language");
	}

	get(key) {
		const value = super.get(key);
		return value;
	}

	set(key, value) {
		super.set(key, value);
	}
}