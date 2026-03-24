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

		if (!this.levelMap.get(level)) {
			return `I'm sorry, I don't know where ${this.getDestination()} ` +
				`is ... I think you might need to backtrack a bit`;
		}

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
	}).getLevelStory("Y")
		== "I'm sorry, I don't know where F is ... I think you might need to backtrack a bit",
	"A non existent level should tell you your lost.")
