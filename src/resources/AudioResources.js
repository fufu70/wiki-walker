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
				start: 0.5
			},
			step1: {
				file: "/sounds/events/Wood Block1.mp3",
				start: 0.5
			},
			step2: {
				file: "/sounds/events/Wood Block3.mp3",
				start: 0.5
			},
			campfire: {
				file: "/sounds/events/soundsforyou-campfire-crackling-fireplace-sound-119594.mp3",
				volume: 0.5
			},
			pickupItem: {
				file: "sounds/events/Modern13.mp3",
				volume: 1
			},
			loseItem: {
				file: "sounds/events/Modern14.mp3",
				volume: 1
			},
			// music
			track3: { file: "sounds/music/symphony/Symphony No. 3 in F Major, Op. 90 - III. Poco allegretto.mp3", },
			track4: { file: "sounds/music/symphony/Beethoven - Symphony No.6 in F major Op.68 - II. Andante molto mosso.mp3", },
			track5: { file: "sounds/music/symphony/Brandenburg Concerto no. 1 in F major, BWV. 1046 - II. Adagio - III. Allegro.mp3", },
			track6: { file: "sounds/music/symphony/Joseph Haydn - Symphony No.49 in F minor - I. Adagio.mp3", },
			track7: { file: "sounds/music/symphony/Peer Gynt Suite no. 1, Op. 46 - II. Aase's Death.mp3", },
			goldberg1: {file: "sounds/music/goldberg-variations/Goldberg Variations, BWV. 988 - Variation 3. Canon on the unison.mp3",},
			goldberg2: {file: "sounds/music/goldberg-variations/Goldberg Variations, BWV. 988 - Variation 25.mp3",},
			goldberg3: {file: "sounds/music/goldberg-variations/Goldberg Variations, BWV. 988 - Variation 15. Canon on the fifth.mp3",},
			goldberg4: {file: "sounds/music/goldberg-variations/Goldberg Variations, BWV. 988 - Variation 12. Canon on the fourth.mp3",},
			goldberg5: {file: "sounds/music/goldberg-variations/Goldberg Variations, BWV. 988 - Variation 22.mp3",},
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