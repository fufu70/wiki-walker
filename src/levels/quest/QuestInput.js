export class QuestInput {
	constructor(callback, difficulty = 1, path = {}) {
		this.callback = callback;
		this.difficulty = difficulty;
		this.path = path;
	}

	addPath(path) {
		this.path[this.difficulty] = {
			...path,
			difficulty: this.difficulty
		};
		this.difficulty -= 1;
	}
}