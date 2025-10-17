import './style.css'
import {resources} from './src/Resources.js';
import {Sprite} from './src/Sprite.js';
import {Vector2} from './src/Vector2.js';
import {GameLoop} from './src/GameLoop.js';
import {Input, LEFT, RIGHT, UP, DOWN} from './src/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from './src/helpers/Grid.js'
import {moveTowards} from './src/helpers/Move.js';
import {OutdoorLevel1} from './src/levels/OutdoorLevel1.js';
import {CaveLevel1} from './src/levels/CaveLevel1.js';
import {IntroductionLevel} from './src/levels/IntroductionLevel.js';
import {QuestionsLevel} from './src/levels/QuestionsLevel.js';
import {WikiSearchLevel} from './src/levels/wiki/WikiSearchLevel.js';
import {WikiLevelFactory} from './src/levels/wiki/WikiLevelFactory.js';
import {Hero} from './src/objects/hero/Hero.js';
import {Rod} from './src/objects/rod/Rod.js';
import {Exit} from './src/objects/exit/Exit.js';
import {Main} from './src/objects/main/Main.js';
import {Inventory} from './src/objects/inventory/Inventory.js';
import {Camera} from './src/objects/Camera.js';
import {GameObject} from './src/GameObject.js';
import {events} from './src/Events.js';
import * as Empty from './src/Math.js';
import {
	PRINCIPLES_OF_AMERICAN_DEMOCRACY,
	SYSTEM_OF_GOVERNMENT,
	RIGHTS_AND_RESPONSIBILITIES,
	COLONIAL_PERIOD_AND_INDEPENDENCE,
	CENTURY_18,
	RECENT_AMERICAN_HISTORY,
	GEOGRAPHY,
	SYMBOLS,
	HOLIDAYS,
} from './src/levels/constants/CivicsQuestions.js';
import {JobManager} from './src/helpers/JobManager.js';
import {default as wtf} from 'wtf_wikipedia';
import {updateFPS} from './console.js';
import {ImageViewer} from './imageViewer.js';
import {VideoViewer} from './videoViewer.js';
import {TableViewer} from './tableViewer.js';

window.wtf = wtf;
window.JobManager = JobManager;
// grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

// building the scene
const mainScene = new Main({
	position: new Vector2(0, 0)
});
// mainScene.setLevel(new OutdoorLevel1());
// mainScene.setLevel(WikiLevelFactory.getTempPageLevel());
mainScene.setLevel(new WikiSearchLevel());
// mainScene.setLevel(new WikiDisambiguationLevel({
// 	links: [
// 	{"type":"internal","page":"Test (assessment)"},
// 	{"type":"internal","page":"Test (2013 film)"},
// 	{"type":"internal","page":"Test (2014 film)"},
// 	{"type":"internal","page":"Test (2025 film)"},
// 	{"type":"internal","page":"Test (group)"},
// 	{"type":"internal","page":"Tests (album)"},{"type":"internal","page":"Testing (album)"},{"type":"internal","page":".test"},{"type":"internal","page":"Software testing"},{"type":"internal","page":"test (Unix)"},{"type":"internal","page":"TEST (x86 instruction)"},{"type":"internal","page":"Test (wrestler)"},{"type":"internal","page":"John Test"},{"type":"internal","page":"Zack Test"},{"type":"internal","page":"Experiment"},{"type":"internal","page":"Statistical hypothesis test"},{"type":"internal","page":"Metal testing"},{"type":"internal","page":"Mechanical testing"},{"type":"internal","page":"Proof test"},{"type":"internal","page":"Product testing"},{"type":"internal","page":"Stress testing"},{"type":"internal","page":"System testing"},{"type":"internal","page":"Test equipment"},{"type":"internal","page":"Test (biology)"},{"type":"internal","page":"Test cricket"},{"type":"internal","page":"Test match (rugby league)"},{"type":"internal","page":"Test match (rugby union)"},{"type":"internal","page":"Test (greyhound competition)"},{"type":"internal","page":"River Test"},{"type":"internal","page":"Test (law)"},{"type":"internal","page":"Old Testament"},{"type":"internal","page":"New Testament"},{"type":"internal","page":"Tester (disambiguation)"},{"type":"internal","page":"The Test (disambiguation)"},{"type":"internal","page":"Examination (disambiguation)"},{"type":"internal","page":"List of tests"},{"type":"internal","page":"Trial (disambiguation)"},{"type":"internal","page":"Validation (disambiguation)"},{"type":"internal","page":"Verification (disambiguation)"}
// ]
// }));
// mainScene.setLevel(new CaveLevel1());
// mainScene.setLevel(new IntroductionLevel({
// 	levelTitle: "Civics Test",
// 	getLevel: () => {
// 		const seed1 = Math.random();
// 		const seed2 = Math.random();
// 		const seed3 = Math.random();
// 		const seed4 = Math.random();
// 		const seed5 = Math.random();
// 		const seed6 = Math.random();
// 		const seed7 = Math.random();
// 		const seed8 = Math.random();
// 		const seed9 = Math.random();
// 		const seed1Func = () => Math.seed(seed1);
// 		const seed2Func = () => Math.seed(seed2);
// 		const seed3Func = () => Math.seed(seed3);
// 		const seed4Func = () => Math.seed(seed4);
// 		const seed5Func = () => Math.seed(seed5);
// 		const seed6Func = () => Math.seed(seed6);
// 		const seed7Func = () => Math.seed(seed7);
// 		const seed8Func = () => Math.seed(seed8);
// 		const seed9Func = () => Math.seed(seed9);

// 		const level1Params = {
// 			seedNumber: seed1,
// 			showNextLevel: true,
// 			questions: [...PRINCIPLES_OF_AMERICAN_DEMOCRACY],
// 			levelTitle: "PRINCIPLES_OF_AMERICAN_DEMOCRACY"
// 		};
// 		const level2Params = {
// 			seedNumber: seed2,
// 			showNextLevel: true,
// 			questions: [...SYSTEM_OF_GOVERNMENT],
// 			levelTitle: "SYSTEM_OF_GOVERNMENT"
// 		};
// 		const level3Params = {
// 			seedNumber: seed3,
// 			showNextLevel: true,
// 			questions: [...RIGHTS_AND_RESPONSIBILITIES],
// 			levelTitle: "RIGHTS_AND_RESPONSIBILITIES"
// 		};
// 		const level4Params = {
// 			seedNumber: seed4,
// 			showNextLevel: true,
// 			questions: [...COLONIAL_PERIOD_AND_INDEPENDENCE],
// 			levelTitle: "COLONIAL_PERIOD_AND_INDEPENDENCE"
// 		};
// 		const level5Params = {
// 			seedNumber: seed5,
// 			showNextLevel: true,
// 			questions: [...CENTURY_18],
// 			levelTitle: "CENTURY_18"
// 		};
// 		const level6Params = {
// 			seedNumber: seed6,
// 			showNextLevel: true,
// 			questions: [...RECENT_AMERICAN_HISTORY],
// 			levelTitle: "RECENT_AMERICAN_HISTORY"
// 		};
// 		const level7Params = {
// 			seedNumber: seed7,
// 			showNextLevel: true,
// 			questions: [...GEOGRAPHY],
// 			levelTitle: "GEOGRAPHY"
// 		};
// 		const level8Params = {
// 			seedNumber: seed8,
// 			showNextLevel: true,
// 			questions: [...SYMBOLS],
// 			levelTitle: "SYMBOLS"
// 		};
// 		const level9Params = {
// 			seedNumber: seed9,
// 			showNextLevel: true,
// 			questions: [...HOLIDAYS],
// 			levelTitle: "HOLIDAYS",
// 			nextLevel: () => {
// 				return new CaveLevel1({
// 					heroPosition: new Vector2(gridCells(10), gridCells(5))
// 				})
// 			}
// 		};
// 		level8Params.nextLevel = () => {
// 			return new QuestionsLevel(level9Params);
// 		}
// 		level7Params.nextLevel = () => {
// 			return new QuestionsLevel(level8Params);
// 		}
// 		level6Params.nextLevel = () => {
// 			return new QuestionsLevel(level7Params);
// 		}
// 		level5Params.nextLevel = () => {
// 			return new QuestionsLevel(level6Params);
// 		}
// 		level4Params.nextLevel = () => {
// 			return new QuestionsLevel(level5Params);
// 		}
// 		level3Params.nextLevel = () => {
// 			return new QuestionsLevel(level4Params);
// 		}
// 		level2Params.nextLevel = () => {
// 			return new QuestionsLevel(level3Params);
// 		}
// 		level1Params.nextLevel = () => {
// 			return new QuestionsLevel(level2Params);
// 		}

// 		level9Params.previousLevel = () => {
// 			return new QuestionsLevel(level8Params);
// 		}
// 		level8Params.previousLevel = () => {
// 			return new QuestionsLevel(level7Params);
// 		}
// 		level7Params.previousLevel = () => {
// 			return new QuestionsLevel(level6Params);
// 		}
// 		level6Params.previousLevel = () => {
// 			return new QuestionsLevel(level5Params);
// 		}
// 		level5Params.previousLevel = () => {
// 			return new QuestionsLevel(level4Params);
// 		}
// 		level4Params.previousLevel = () => {
// 			return new QuestionsLevel(level3Params);
// 		}
// 		level3Params.previousLevel = () => {
// 			return new QuestionsLevel(level2Params);
// 		}
// 		level2Params.previousLevel = () => {
// 			return new QuestionsLevel(level1Params);
// 		}
// 		level1Params.previousLevel = () => {
// 			return new IntroductionLevel();
// 		}
// 		return new QuestionsLevel(level1Params);
// 	}
// }));


const draw = () => {
	ctx.clearRect(0, 0, canvas.windows, canvas.height);
	mainScene.drawBackground(ctx);

	ctx.save();

	if (mainScene.camera) {
		// Offset by camera position
		ctx.translate(mainScene.camera.position.x, mainScene.camera.position.y);	
	}

	// Draw objects in the mounted scene
	mainScene.drawObjects(ctx);

	// restore the original state
	ctx.restore();
	updateFPS();

	mainScene.drawForeground(ctx);
}

const update = (delta) => {
	mainScene.stepEntry(delta, mainScene);
	mainScene.input?.update();
}

// Start the game
const gameLoop = new GameLoop(update, draw);
gameLoop.start();