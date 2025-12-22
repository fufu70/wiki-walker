import {
	languages,
	STORY,
} from './constants.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';

export class Story {
	static getDialog(flag, lang = undefined) {
		if (!lang) {
			lang = languages[WikiLevelFactory.getLanguage()];
		}
		return STORY[flag][lang];
	}
}