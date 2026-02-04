import {LanguageStorage} from './LanguageStorage.js';
import {languages} from './constants.js';

const DEFAULT_LANGUAGE = "English";

export class LanguageFactory {
	static storage = new LanguageStorage();

	/**
	 * LANGUAGE
	 */
	
	static getLanguage() {
		const factory = new LanguageFactory();
		if (factory.getStorageLanguage() === undefined) {
			LanguageFactory.updateLanguage(DEFAULT_LANGUAGE);
		}
		return Object.keys(languages).find(lang => languages[lang] == factory.getStorageLanguage())
	}

	static getLanguages() {
		return Object.keys(languages); 
	}

	static updateLanguage(text) {
		const factory = new LanguageFactory();
		factory.setStorageLanguage(languages[text])
	}

	static getLang() {
		const factory = new LanguageFactory();
		if (factory.getStorageLanguage() === undefined) {
			LanguageFactory.updateLanguage(DEFAULT_LANGUAGE);
		}
		return factory.getStorageLanguage();
	}

	getStorageLanguage() {
		return LanguageFactory.storage.get('language');
	}

	setStorageLanguage(val) {
		LanguageFactory.storage.set('language', val);
	}
}