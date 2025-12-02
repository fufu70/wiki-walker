import {Storage} from '../../helpers/Storage.js';

export class WikiStorage extends Storage {

	constructor() {
		super("WIKI");
	}

	get(key) {
		const value = super.get(key);
		return value;
	}

	set(key, value) {
		super.set(key, value);
	}
}