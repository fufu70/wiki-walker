import {
	languages,
	STORY,
	YES_FLAG,
	NO_FLAG
} from './constants.js';
import {LanguageFactory} from './LanguageFactory.js';

export class Story {
	static getDialog(flag, lang = undefined) {
		if (!lang) {
			lang = languages[LanguageFactory.getLanguage()];
		}
		return STORY[flag][lang];
	}

	static getConfirmationOptions(lang = undefined) {
		if (!lang) {
			lang = languages[LanguageFactory.getLanguage()];
		}
		return [
			STORY[YES_FLAG][lang],
			STORY[NO_FLAG][lang],
		];
	}

	static isConfirmation(text, lang = undefined) {
		if (!lang) {
			lang = languages[LanguageFactory.getLanguage()];
		}
		return  STORY[YES_FLAG][lang] === text;
	}
}