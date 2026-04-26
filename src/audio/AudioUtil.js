export class AudioUtil {
	static getVolumeByDistance(a, b) {
		return (new AudioUtil()).getDistanceVolume(a, b);
	}

	getDistanceVolume(a, b) {
		let volume = Math.abs(16 / this.distance(a, b));
		if (volume < 0.25) {
			volume = 0;
		}
		return volume;
	}

	distance(a, b) {
		const c = Math.pow(a.x - b.x, 2);
		const d = Math.pow(a.y - b.y, 2);
		return Math.sqrt(c + d);
	}
}