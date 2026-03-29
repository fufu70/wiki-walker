import {Story} from '../../stories/Story.js';
import {storyFlags} from '../../StoryFlags.js';
import {QuestStorage} from './QuestStorage.js';

export class Quest {
	constructor(path) {
		this.path = path;
		this.levelMap = new Map();
		this.storage = new QuestStorage();

		const keys = Object.keys(this.path);
		let maxDifficulty = 0;
		for (let i = 0; i < keys.length; i ++) {
			this.levelMap.set(this.path[keys[i]].level, this.path[keys[i]]);
			if (this.path[keys[i]].difficulty > maxDifficulty) {
				maxDifficulty = this.path[keys[i]].difficulty;
			}
		}

		this.rootLevel = this.path[maxDifficulty].level;
		this.name = this.rootLevel;
	}

	getConfirmationStory() {
		return `Wanna help me find my friend at ${this.getDestination()}`;
	}

	getAcceptanceStory() {
		return `Thank you for helping me find my friend at ${this.getDestination()}. It'll ` +
			`be a journey but if you go down ${this.getRoom()} and find ` +
			`${this.getStairs()} you may get someone to help you out. ` +
			`They're always very helpful down there`;
	}

	getLevelStory(level) {

		if (level == this.path[1].exit) {
			return `You found me! I really appreciate ${this.rootLevel} asking about me.` +
				`It's always good to have friends that look out for each other.`;
		}

		if (!this.levelMap.get(level)) {
			return `I'm sorry, I don't know where ${this.getDestination()} ` +
				`is ... I think you might need to backtrack a bit`;
		}

		if (level != this.rootLevel) {

		}
		return `Ah! It looks like your looking for someone at ${this.getDestination()}! ` +
			`It's nice of you to help out ${this.rootLevel}. ` +
			`I know the path you'll need to take. ` +
			`Go to room ${this.getRoom(level)} and find the stairs ` +
			`with the name ${this.getStairs(level)}. Fly you fool!`;

		return `Ah! It looks like your looking for my friend at ${this.getDestination()}! ` +
			`I can't go there myself but I know the path you'll need to take. ` +
			`Go to room ${this.getRoom(level)} and find the stairs ` +
			`with the name ${this.getStairs(level)}. Fly you fool!`;
	}

	getDestination() {
		return this.path[1].exit;
	}

	getRoom(level) {
		if (!level) {
			level = this.rootLevel
		}
		return this.levelMap.get(level).room;
	}

	getStairs(level) {
		if (!level) {
			level = this.rootLevel
		}
		return this.levelMap.get(level).exit;
	}

	getNpcContent(title, uuid) {
		if (title != this.name) {
			return [
				{
					stringFunc: () => {
						return this.getLevelStory(title);
					}
				}
			]
		}
		return [
			{
				eventType: "SELECT_INPUT",
				stringFunc: () => {
					return this.getConfirmationStory();
				},
				uuid: uuid,
				options: Story.getConfirmationOptions(),
				bypass: [`ACCEPTED_QUEST_${this.name}`],
				addFlag: `ACCEPTED_QUEST_${this.name}`
			},
			{
				stringFunc: () => {
					return this.getAcceptanceStory();
				},
				bypass: [`INTRODUCED_QUEST_${this.name}`],
				addFlag: `INTRODUCED_QUEST_${this.name}`,
				requires: [`ACCEPTED_QUEST_${this.name}`]
			},
			{
				stringFunc: () => {
					return this.getLevelStory(title);
				},
				requires: [`INTRODUCED_QUEST_${this.name}`]
			},
		];
	}

	acceptQuest() {
		storyFlags.add(`ACCEPTED_QUEST_${this.name}`)
		let accepted = this.storage.get("accepted")
		if (!accepted) {
			accepted = [];
		}
		accepted.push(this.path);
		this.storage.set("accepted", accepted);
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
