export class AudioFile {
	constructor(resource, startTime) {
		this.resource = resource;
		this.startTime = startTime;
		this.audioObj = new Audio(this.resource);
		this.audioObj.currentTime = this.startTime;
	}

	play() {
		this.audioObj.pause();
		this.audioObj.currentTime = this.startTime;
		this.audioObj.play();
	}

	loop() {
		try {
			this.loop = true;
			this.play();
		} catch {
			this.loop();
		}
	}
}