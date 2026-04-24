export class AudioFile {
	constructor(resource, startTime) {
		this.resource = resource;
		this.startTime = startTime ?? 0;
		this.audioObj = new Audio(this.resource);
		this.audioObj.currentTime = this.startTime;
		this.playing = false;
		this.targetVolume = 1;
		this.volumeIncrease = 0.0023 ; // in percent per millisecond
		this.volumeInterval = undefined;
	}

	play() {
		if (!this.volumeInterval) {
			this.volumeInterval = setInterval(() => {
				this.fader();
			}, 20);
		}

		this.playing = true;
		let obj = this.audioObj;
		if (!this.audioObj.paused) {
			obj = new Audio(this.resource);
		}
		obj.currentTime = this.startTime;
		obj.play();
	}

	loop() {
		if (this.playing) {
			return;
		}
		this.audioObj.loop = true;
		this.play();
	}

	loopHandler() {
		this.play();
	}

	stop() {
		this.playing = false;
		this.audioObj.loop = false;
		this.audioObj.pause();
		this.audioObj.currentTime = this.startTime;
		clearInterval(this.volumeInterval);
	}

	fade(dest) {
		this.targetVolume = dest;
	}

	fader() {
		if (!this.lastTime) {
			this.lastTime = Date.now();
		}
		if (!this.audioObj) {
			return;
		}
	    var now= Date.now() ;
	    var dt = now - this.lastTime ;
	    this.lastTime = now;
	    var diff = this.targetVolume - this.audioObj.volume ;
	    if (diff == 0 ) return;
	    if (Math.abs ( diff )  < 5* this.volumeIncrease*dt ) {
	        this.audioObj.volume = this.targetVolume ;
	        return ;
	    }
	    var chg = (diff > 0) ?  this.volumeIncrease : - this.volumeIncrease ;
	    chg *=  dt ;
	    var newTestVolume = this.audioObj.volume + chg;    
	    this.audioObj.volume = newTestVolume ;
	}
}