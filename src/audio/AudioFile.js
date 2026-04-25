export class AudioFile {
	constructor(resource, startTime, volume) {
		this.resource = resource;
		this.startTime = startTime ?? 0;
		this.audioObj = new Audio(this.resource);
		this.audioObj.currentTime = this.startTime;
		this.playing = false;
		this.targetVolume = volume ?? 1;
		this.volumeIncrease = 0.0023 ; // in percent per millisecond
		this.volumeInterval = undefined;
	}

	play(callback) {
		

		this.playing = true;
		let obj = this.audioObj;
		if (!this.audioObj.paused) {
			obj = new Audio(this.resource);
		}

		console.log("Playing", this.resource);

		obj.currentTime = this.startTime;
		if (callback) {
			this.eventFunc = undefined;
			this.timeHandler = () => {
				if (obj.currentTime > obj.duration - 1) {
					callback();
					obj.removeEventListener('timeupdate', this.timeHandler);
				}
			};
			obj.addEventListener('timeupdate', this.timeHandler);
		}

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
		if (this.timeHandler) {
			this.audioObj.removeEventListener('timeupdate', this.timeHandler);	
		}
	}

	fade(dest) {
		if (this.targetVolume == 0 && dest > 0) {
			this.audioObj.play();
		}
		
		this.targetVolume = dest;
		// if (!this.volumeInterval) {
			this.volumeInterval = setInterval(() => {
				this.fader();
			    let diff = this.targetVolume - this.audioObj.volume ;
			    if (diff == 0) {
					clearInterval(this.volumeInterval);
				}
			}, 20);
		// }
	}

	fader() {
		if (!this.lastTime) {
			this.lastTime = Date.now();
		}
		if (!this.audioObj) {
			return;
		}
	    let now= Date.now() ;
	    let dt = now - this.lastTime ;
	    this.lastTime = now;
	    let diff = this.targetVolume - this.audioObj.volume ;
	    if (diff == 0 ) return;
	    if (Math.abs ( diff )  < 5* this.volumeIncrease*dt ) {
	        this.audioObj.volume = this.targetVolume ;
	        if (this.audioObj.volume == 0) {
	        	this.audioObj.pause();
	        }
	        return ;
	    }
	    let chg = (diff > 0) ?  this.volumeIncrease : - this.volumeIncrease ;
	    chg *=  dt ;
	    let newTestVolume = this.audioObj.volume + chg;    
	    this.audioObj.volume = newTestVolume ;
	}
}