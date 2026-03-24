export class Quest {
	constructor(path) {
		this.path = path;
		this.levelMap = new Map();

		const keys = Object.keys(this.path);
		for (let i = 0; i < keys.length; i ++) {
			this.levelMap.set(this.path[keys[i]].level, this.path[keys[i]]);
		}
	}

	getLevelStory(level) {

		return `Ah! It looks like your looking for my friend at ${this.getDestination()}! ` +
			`I can't go there myself but I know the path you'll need to take. ` +
			`Go to room ${this.getRoom(level)} and find the stairs ` +
			`with the name ${this.getStairs(level)}. Fly you fool!`;
	}

	getDestination() {
		return this.path[1].exit;
	}

	getRoom(level) {
		return this.levelMap.get(level).room;
	}

	getStairs(level) {
		return this.levelMap.get(level).exit;
	}
}

console.log(new Quest({
		2: {
			level: "A",
			room: "B",
			exit: "C",
			difficulty: 2,
		},
		1: {
			level: "D",
			room: "E",
			exit: "F",
			difficulty: 1
		}
	}).getLevelStory("A"));

console.assert(
	new Quest({
		2: {
			level: "A",
			room: "B",
			exit: "C",
			difficulty: 2,
		},
		1: {
			level: "D",
			room: "E",
			exit: "F",
			difficulty: 1
		}
	}).getLevelStory("A")
		== "Ah! It looks like your looking for my friend at F! I can't go there myself but I know the path you'll need to take. Go to room B and find the stairs with the name C. Fly you fool!",
	"Story should match");