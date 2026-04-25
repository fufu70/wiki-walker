export class Playlist {
	constructor(tracks, index) {

		this.tracks = tracks;
		if (!index) {
			index = Math.floor(Math.random() * this.tracks.length);
		}
		this.index = index;
		console.log("Playlist", this);
	}

	play() {
		this.tracks[this.index].play(() => {
			this.next();
		});
		this.tracks[this.index].fade(1);
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