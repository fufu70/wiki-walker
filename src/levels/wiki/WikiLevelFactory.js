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

	static storedLocation() {
		return WikiLevelFactory.storage.get('lastPosition') != undefined
			&& WikiLevelFactory.storage.get('lastPosition') != null;
	}

	static updateLastPosition(levelParams, position) {
		WikiLevelFactory.storage.set('lastPosition', {
			title: levelParams.title,
			language: WikiLevelFactory.getLanguage(),
			position: position
		})
	}

	static loadLastLocation() {
		return WikiLevelFactory.storage.get('lastPosition');
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

		window.doc = doc;
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
			infobox: this.getInfoBox(doc),
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
	 * Infoboxes contain a multitude of information that can be gleaned from the entire article and 
	 * also hidden information, like what the coordinates are from a location. For our purposes we 
	 * will pull in all information from the info boxes "text" attributes. The coordinates will be 
	 * treated seperately and cleaned to allow external map visualizations to pin point the location
	 * on a map.
	 * 
	 * [	
	 * 	{
	 * 		"birth_name":{"text":"Francis Harry Compton Crick"},
	 * 		"image":{"text":"Francis Crick crop.jpg"},
	 * 		"birth_date":{"text":"June 8, 1916"},
	 * 		"birth_place":{"text":"Weston Favell, Northamptonshire, England","links":[{"type":"internal","page":"Weston Favell"}]},
	 * 		"death_date":{"text":"July 28, 2004"},
	 * 		"death_place":{"text":"San Diego, California, US","links":[{"type":"internal","page":"San Diego"}]},
	 * 		"occupation":{"text":"Molecular biologist · biophysicist · neuroscientist"},
	 * 		"field":{"text":"Physics\n\nMolecular biology","links":[{"type":"internal","page":"Physics"},{"type":"internal","page":"Molecular biology"}]},
	 * 		"education":{"text":"University College London\n\nUniversity of London (BSc)\n\nUniversity of Cambridge (PhD)","links":[{"type":"internal","page":"University College London"},{"type":"internal","page":"University of London"},{"type":"internal","page":"University of Cambridge"}]},
	 * 		"workplaces":{"text":"University of Cambridge\n\nUniversity College London\n\nCavendish Laboratory\n\nLaboratory of Molecular Biology\n\nSalk Institute for Biological Studies","links":[{"type":"internal","page":"Cavendish Laboratory"},{"type":"internal","page":"Laboratory of Molecular Biology"},{"type":"internal","page":"Salk Institute for Biological Studies"}]},
	 * 		"doctoral_advisor":{"text":"Max Perutz","links":[{"type":"internal","page":"Max Perutz"}
	 * 		...
	 */
	getInfoBox(doc) {
		if (!doc.infobox()) {
			return undefined;
		}
		const infobox = doc.infobox().json();
		const map = Object.keys(infobox).reduce((acc, curr) => { 
			acc[curr] = infobox[curr].text; 
			return acc;
		}, {});
		// const 
		return map;
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