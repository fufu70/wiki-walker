export class AudioFile {
	constructor(resource) {
		this.resource = resource;
		this.audioObj = new Audio(this.resource);
	}

	play() {
		this.audioObj.pause();
		this.audioObj.currentTime = 0;
		this.audioObj.play();
	}
}