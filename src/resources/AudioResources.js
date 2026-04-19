import {AudioFile} from '../audio/AudioFile.js';

class AudioResources {
	constructor() {
		// Everything we plan to downlaod
		this.toLoad = {
			selectInput: {
				file: "/sounds/events/Retro10.mp3",
				start: 0.05,
			},
			textInput: {
				file: "/sounds/events/Retro6.mp3",
				start: 0.005,
			},
			select: {
				file: "/sounds/events/Retro5.mp3",
				start: 0.005,
			},
			change: {
				file: "/sounds/events/Retro3.mp3",
				start: 0.005,
			},
			cancel: {
				file: "/sounds/events/Retro4.mp3",
				start: 0.005,
			},
			typing: {
				file: "/sounds/events/dragon-studio-keyboard-typing-effect-free-393912.mp3",
			},
			// music
			track1: {
				file: "/sounds/music/loop.mp3",
				start: 0.0,
			},
			track2: {
				file: "/sounds/music/freesound_community-sunset-walk-54956.mp3",
				start: 0.0,
			},
		}

		// a bucket to keep all of our images
		this.audio = {};

		// Load each image
		Object.keys(this.toLoad).forEach(key => {
			this.audio[key] = new AudioFile(
				this.toLoad[key].file,
				this.toLoad[key].start
			)
		})
	}
}

export const audioResources = new AudioResources();