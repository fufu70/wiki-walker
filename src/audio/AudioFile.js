export class AudioFile {
	constructor(resource, startTime) {
		this.resource = resource;
		this.startTime = startTime ?? 0;
		this.audioObj = new Audio(this.resource);
		this.audioObj.currentTime = this.startTime;
		this.playing = false;
	}

	play() {
		this.playing = true;
		this.audioObj.pause();
		this.audioObj.currentTime = this.startTime;
		this.audioObj.play();
	}

	loop() {
		if (this.playing) {
			return;
		}

		this.playing = true;
		this.audioObj.addEventListener('ended', () => {
			this.play();
		});
		this.play();
	}

	stop() {
		this.audioObj.pause();
		this.playing = false;
		this.audioObj.currentTime = this.startTime;
	}
}