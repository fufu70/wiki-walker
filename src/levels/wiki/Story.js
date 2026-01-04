import {
	languages,
	STORY,
	YES_FLAG,
	NO_FLAG
} from './constants.js';
import {WikiLevelFactory} from './WikiLevelFactory.js';

export class Story {
	static getDialog(flag, lang = undefined) {
		if (!lang) {
			lang = languages[WikiLevelFactory.getLanguage()];
		}
		return STORY[flag][lang];
	}

	static getConfirmationOptions(lang = undefined) {
		if (!lang) {
			lang = languages[WikiLevelFactory.getLanguage()];
		}
		return [
			STORY[YES_FLAG][lang],
			STORY[NO_FLAG][lang],
		];
	}
}