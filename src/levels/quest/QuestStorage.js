import {Storage} from '../../helpers/Storage.js';

export class QuestStorage extends Storage {

	constructor() {
		super("QUEST");
	}

	get(key) {
		const value = super.get(key);
		return value;
	}

	set(key, value) {
		super.set(key, value);
	}
}