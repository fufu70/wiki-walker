export class Playlist {
	constructor(tracks, index, volume) {

		this.tracks = tracks;
		if (!index) {
			index = Math.floor(Math.random() * this.tracks.length);
		}
		this.index = index;
		this.volume = volume ?? 1;
		console.log("Playlist", this);
	}

	setVolume(volume) {
		this.volume = volume;
		this.tracks[this.index].fade(this.volume);
	}

	play() {
		this.tracks[this.index].play(() => {
			this.next();
		});
		this.tracks[this.index].fade(this.volume);
	}

	stop() {
		this.tracks[this.index].fade(0);

		setTimeout(() => {
			this.tracks[this.index].stop();
		}, 20);
	}

	playing() {
		return this.tracks[this.index];
	}

	previous() {
		const trackIndex = this.index;
		this.tracks[trackIndex].fade(0);
		this.index --;
		if (this.index < 0) {
			this.index = this.tracks.length - 1;
		}

		setTimeout(() => {
			this.tracks[trackIndex].stop();
			this.play();
		}, 20);
	}

	next() {
		const trackIndex = this.index;
		this.tracks[trackIndex].fade(0);
		this.index ++;
		if (this.index >= this.tracks.length) {
			this.index = 0;
		}
		setTimeout(() => {
			this.tracks[trackIndex].stop();
			this.play();
		}, 20);
	}
}