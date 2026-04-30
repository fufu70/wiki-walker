import {audioResources} from '../resources/AudioResources.js';
import {Playlist} from './Playlist.js';

const songs = [
	audioResources.audio.track3,
	audioResources.audio.track4,
	audioResources.audio.track5,
	audioResources.audio.track6,
	audioResources.audio.track7,
	audioResources.audio.goldberg1,
	audioResources.audio.goldberg2,
	audioResources.audio.goldberg3,
	audioResources.audio.goldberg4,
	audioResources.audio.goldberg5,
];

export class PlaylistFactory {
	
	static get() {
		const factory = new PlaylistFactory;
		const playlist = factory.getRandomPlaylist();
		console.log(factory, playlist);
		return playlist;
	}

	getRandomPlaylist() {
		return new Playlist(this.getRandomSongs(5), undefined, 0.35);
	}

	getRandomSongs(length) {
		const playlistSongs = [];
		for (let i = 0; i < length; i ++) {
			const index = Math.floor(Math.random() * (songs.length - 1));
			playlistSongs.push(songs[index]);
		}
		return playlistSongs;
	}
}