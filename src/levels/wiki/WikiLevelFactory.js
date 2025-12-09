import {WikiDisambiguationLevel} from './WikiDisambiguationLevel.js';
import {WikiPageLevel} from './WikiPageLevel.js';
import {WikiSearchLevel} from './WikiSearchLevel.js';
import {ArrayFactory} from '../../helpers/ArrayFactory.js';
import {WikiStorage} from './WikiStorage.js';
import {languages} from './constants.js';

const DEFAULT_LANGUAGE = "English";

export class WikiLevelFactory {
	static storage = new WikiStorage();
	static levelStack = [];

	/**
	 * SAVE PREVIOUS LEVEL INFO
	 */
	static stashPageLevel(heroPosition, levelParams) {
		WikiLevelFactory.stashLevel(
			heroPosition,
			"WikiPageLevel",
			levelParams
		);
	}

	static stashDisambiguationLevel(heroPosition, levelParams) {
		WikiLevelFactory.stashLevel(
			heroPosition,
			"WikiDisambiguationLevel",
			levelParams
		);
	}

	static stashSearchLevel(heroPosition, levelParams) {
		WikiLevelFactory.stashLevel(
			heroPosition,
			"WikiSearchLevel",
			levelParams
		);
	}

	static stashLevel(heroPosition, type, levelParams) {
		WikiLevelFactory.levelStack.push({
			position: heroPosition,
			type: type,
			levelParams: levelParams
		});
	}

	static popLevel() {
		return WikiLevelFactory.levelStack.pop();
	}

	static loadPop(popped) {
		let level = undefined;
		console.log(popped);
		if (popped?.type == "WikiPageLevel") {
			level = new WikiPageLevel(popped.levelParams);
		}
		if (popped?.type == "WikiDisambiguationLevel") {
			level = new WikiDisambiguationLevel(popped.levelParams);
		}
		if (popped?.type == "WikiSearchLevel") {
			level = new WikiSearchLevel(popped.levelParams);
		}
		level.teleportHero(popped.position);
		return level;
	}

	/**
	 * LEVEL GENERATION
	 */

	static request(text, callback, error) {
		const factory = new WikiLevelFactory();
		wtf.fetch(text, factory.getLang(), function(err, doc) {
			if (err == null && doc == null) {
				error(`Article for '${text}' does not exist. Sorry.`)
			}
			if (err !== null) {
				error(err.message);
			} else {
				callback(WikiLevelFactory.getLevel(doc));
			}
		})
	}

	static random(callback, error) {
		const factory = new WikiLevelFactory();
		wtf.getRandomPage({lang:factory.getLang()}).then((doc) => {
			callback(WikiLevelFactory.getLevel(doc));
		});
	}

	static getLevel(doc) {
		const factory = new WikiLevelFactory();
		// console.log("DOC", doc);
		if (doc.isDisambiguation()) {
			return factory.getDisambiguationLevel(doc);
		} else {
			return factory.getPageLevel(doc);
		}
	}

	getDisambiguationLevel(doc) {
		return new WikiDisambiguationLevel(this.getDisambiguationParams(doc));
	}

	getPageLevel(doc) {
		return new WikiPageLevel(this.getPageParams(doc))
	}

	getDisambiguationParams(doc) {
		const links = this.getLinks(doc);
		return {
			doc: doc,
			links: links,
			seedNumber: this.getDisambiguationSeed(links),
		};
	}


	getDisambiguationSeed(links) {
		return Array.from(links.reduce((p, c) => {
			return p + ',' + c.page
		}, "")).reduce((p, c) => {
			return `${c}`.charCodeAt(0) + p
		}, 0);
	}

	getPageParams(doc) {
		const sections = doc.sections().map(section => {
			return {
				uuid: crypto.randomUUID(),
				title: section.title(),
				paragraphs: section.paragraphs().map(paragraph => paragraph.text()),
				links: this.getLinks(section),
				tables: section.tables().map(table => table.keyValue()),
				doc: section,
			};
		});

		const images = doc.images().map(image => {
			return {
				url: image.url(),
				caption: image.caption()
			}
		});

		return {
			doc: doc,
			uuid: crypto.randomUUID(),
			title: doc.title(),
			sections: sections,
			images: this.getImages(doc),
			videos: this.getVideos(doc),
			seedNumber: this.getPageSeed(doc.title())
		};
	}

	getImages(doc) {
		return doc.images()
			.filter(image => this.isImage(image.url()))
			.map(image => {
				return {
					url: image.url(),
					caption: image.caption()
				}
			});
	}

	isImage(url) {
		const SUPPORTED_TYPES = ["png", "jpg", "jpeg"];
		const urlParts = url.split(".");
		return SUPPORTED_TYPES.indexOf(urlParts[urlParts.length - 1]) > -1;
	}


	getVideos(doc) {
		return doc.images()
			.filter(image => this.isVideo(image.url()))
			.map(image => {
				return {
					urls: [image.url()],
					caption: image.caption()
				}
			});
	}

	isVideo(url) {
		const SUPPORTED_TYPES = ["ogv", "webm", "mp4"];
		const urlParts = url.split(".");
		return SUPPORTED_TYPES.indexOf(urlParts[urlParts.length - 1]) > -1;
	}

	getPageSeed(title) {
		return Array.from(title).reduce((p, c) => {
			return `${c}`.charCodeAt(0) + p
		}, 0);
	}

	getLinks(doc) {
		let links = [];
		if (typeof doc.links === 'function') {
			links = doc.links();
		} else {
			links = doc.links;
		}

		return ArrayFactory.removeDuplicates(links.map(link => {
			if (typeof link.page === 'function') {

				return {
					type: link.type(),
					page: link.page()
				};	
			}

			return {
				type: link.type,
				page: link.page
			};
		}).filter(link => {
			return link.page !== undefined
		}));
	}

	/**
	 * LANGUAGE
	 */
	
	static getLanguage() {
		const factory = new WikiLevelFactory();
		if (factory.getStorageLanguage() === undefined) {
			factory.updateLanguage(DEFAULT_LANGUAGE);
		}
		return Object.keys(languages).find(lang => languages[lang] == factory.getStorageLanguage())
	}

	static getLanguages() {
		return Object.keys(languages); 
	}

	static updateLanguage(text) {
		const factory = new WikiLevelFactory();
		factory.setStorageLanguage(languages[text])
	}

	getLang() {
		if (this.getStorageLanguage() === undefined) {
			WikiLevelFactory.updateLanguage(DEFAULT_LANGUAGE);
		}
		return this.getStorageLanguage();
	}

	getStorageLanguage() {
		return WikiLevelFactory.storage.get('language');
	}

	setStorageLanguage(val) {
		WikiLevelFactory.storage.set('language', val);
	}
}