import {AudioFile} from '../audio/AudioFile.js';

class AudioResources {
	constructor() {
		// Everything we plan to downlaod
		this.toLoad = {
			selectInput: "/sounds/events/Retro10.mp3",
			textInput: "/sounds/events/Retro6.mp3",
			select: "/sounds/events/Retro5.mp3",
			change: "/sounds/events/Retro3.mp3",
			cancel: "/sounds/events/Retro4.mp3",
		}

		// a bucket to keep all of our images
		this.audio = {};

		// Load each image
		Object.keys(this.toLoad).forEach(key => {
			this.audio[key] = new AudioFile(this.toLoad[key])
		})
	}
}

export const audioResources = new AudioResources();