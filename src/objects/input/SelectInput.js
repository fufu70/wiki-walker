import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../input/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {getCharacterAnimations} from './Animations.js';
import {SUPPORTED_CHARACTERS} from '../textbox/spriteFontMap.js';
import {UserInputBox} from './UserInputBox.js';


export class SelectInput extends UserInputBox {
	MAX_VISIBLE_OPTIONS = 7 - 1;
	LINE_HEIGHT = 14;
	MAX_LINES = 7;

	constructor(config = {}) {
		super(config);

		this.options = config.options ?? ["Default Option"];
		this.options = this.options.sort((a, b) => {
			return a.toUpperCase().localeCompare(b.toUpperCase());
		});
		this.selected = this.getSelected(config)
		this.selectedOptionIndex = this.options.indexOf(this.selected);
		this.triangle = this.typewriter.getCharacterSprite("▶");
		this.stepToNextMove = 100;
		this.lastMove = this.stepToNextMove;
		this.updateIndexState();

		// User Text Input
		this.input = new Input(SUPPORTED_CHARACTERS);
	}

	getSelected(config) {
		if (config.selectedFunc) {
			return config.selectedFunc();
		}
		if (config.selected) {
			return config.selected;
		}
		return this.options[0];
	}

	step(delta, root) {
		super.step(delta, root);
		this.moveSelection(delta);
		this.changeVisibleSelection();
		this.updateUserInput();
		this.addTriangle();
	}

	moveSelection(delta) {
		this.lastMove -= delta;
		if (this.lastMove > 0)  {
			return;
		}

		if (this.input.direction === UP) {
			this.selectedOptionIndex --;
			if (this.selectedOptionIndex <= 0) {
				this.selectedOptionIndex = 0;
			}
			this.lastMove = this.stepToNextMove;
		}

		if (this.input.direction === DOWN) {
			this.selectedOptionIndex ++;
			if (this.selectedOptionIndex >= this.options.length - 1) {
				this.selectedOptionIndex = this.options.length - 1;
			}
			this.lastMove = this.stepToNextMove;
		}
	}

	changeVisibleSelection() {
		let selectedLine = 0;
		if (this.optionIndexMap !== undefined) {
			selectedLine = this.optionIndexMap[this.selectedOptionIndex].line;
		}
		
		if (selectedLine >= this.visibleEndLine) {
			const max = selectedLine + this.optionIndexMap[this.selectedOptionIndex].size;
			this.visibleStartLine = max - this.maxVisibleLines;
			this.visibleEndLine = max;
		}

		if (selectedLine <= this.visibleStartLine) {
			this.visibleStartLine = selectedLine;
			this.visibleEndLine = selectedLine + this.maxVisibleLines;
		}
	}

	updateUserInput() {
		this.userInput = this.options[this.selectedOptionIndex];
	}

	addTriangle() {
		if (this.typewriter.showingIndex >= this.typewriter.finalIndex && !this.hasChild(this.triangle)) {
			this.addChild(this.triangle);
		}
	}

	drawInput(ctx, drawPosX, drawPosY, cursorX, cursorY, currentShowingIndex) {
		this.cursorPosition = 0;
		this.updateIndexState(drawPosX, cursorY);
		const offset = this.getOffset(cursorY);
		let triangleY = 0;
		let lineAdjust = 0;

		this.options.forEach((option, index) => {
			if (this.hiddenLine(this.optionIndexMap[index].line)) {
				return;
			}

			const visibleIndex = this.shiftToVisibleLine(this.optionIndexMap[index].line, this.visibleStartLine);
			// console.log(visibleIndex);
			let line = visibleIndex;
			cursorX = offset.x + 18;
			cursorY = offset.y + ((this.LINE_HEIGHT * visibleIndex));
			if (index === this.selectedOptionIndex) {
				triangleY = cursorY;
			}
			
			const words = this.typewriter.generateWords(option);

			for (var i = 0; i < words.length; i++) {
				const word = words[i]

				// if the word requires a new line increment visible 
				if (this.typewriter.requiresNewLine(drawPosX, cursorX, word)) {
					line ++;
				}
				if (line > this.maxVisibleLines) {
					break;
				}
				const cursorPosition = this.typewriter.drawWord(ctx, drawPosX, cursorX, cursorY, currentShowingIndex, word);
				cursorX = cursorPosition.cursorX;
				cursorY = cursorPosition.cursorY;
				currentShowingIndex = cursorPosition.currentShowingIndex;
			};
		});

		if (currentShowingIndex >= this.typewriter.finalIndex) {
			this.drawTriangle(triangleY);
		}
	}

	getOffset(cursorY) {
		return {x: 52, y: cursorY + this.LINE_HEIGHT};
	}

	generateIndexes(drawPosX, cursorY) {
		const dummyCtx = {
			drawImage: (...args) => {}
		}
		const offset = this.getOffset(cursorY);
		let cursorX = 0;

		const optionIndexMap = {};
		let lineAdjust = 0;

		for (let index = 0; index < this.options.length; index ++) {
			const option = this.options[index];
			let size = 1;

			optionIndexMap[index] = {
				line: index + lineAdjust, 
				size: size
			};
			cursorX = offset.x + 18;
			cursorY = offset.y;
			
			const words = this.typewriter.generateWords(option);

			for (var i = 0; i < words.length; i++) {
				const word = words[i]

				// if the word requires a new line and the 
				if (this.typewriter.requiresNewLine(drawPosX, cursorX, word)) {
					lineAdjust ++;
					size ++;
				}
				const cursorPosition = this.typewriter.drawWord(dummyCtx, drawPosX, cursorX, cursorY, 0, word);
				cursorX = cursorPosition.cursorX;
				cursorY = cursorPosition.cursorY;
			};

			optionIndexMap[index].size = size;
		}

		return optionIndexMap;
	}

	updateIndexState(drawPosX, cursorY) {
		if (cursorY === this.cursorY) {
			return;
		}
		this.cursorY = cursorY;
		this.maxVisibleLines = this.getMaxVisibleLines(cursorY);
		this.optionIndexMap = this.generateIndexes(drawPosX, cursorY);
		this.visibleStartLine = this.getVisibleStartLine(this.selectedOptionIndex, this.maxVisibleLines);
		this.visibleEndLine = this.getVisibleEndLine(this.selectedOptionIndex, this.maxVisibleLines);
		console.log(this.optionIndexMap);
	}

	drawTriangle(y) {
		this.triangle.position = new Vector2(25, y - 32);
	}

	getMaxVisibleLines(cursorY) {
		let max = this.MAX_VISIBLE_OPTIONS;
		max = Math.ceil(max - ((cursorY - this.PADDING_TOP) / this.LINE_HEIGHT));
		max = Math.max(1, Math.min(max, this.options.length));
		return max;
	}

	getVisibleStartLine(selectedOptionIndex, maxVisibleLines) {
		let selectedLine = this.optionIndexMap[selectedOptionIndex].line;
		let maxLine = this.optionIndexMap[this.options.length - 1].line
			+ this.optionIndexMap[this.options.length - 1].size;
		if (selectedLine > maxLine - maxVisibleLines) {
			return maxLine - 1 - maxVisibleLines;
		}
		return selectedLine;
	}

	getVisibleEndLine(selectedOptionIndex, maxVisibleLines) {
		return selectedOptionIndex + maxVisibleLines;
	}

	hiddenLine(line) {
		return line < this.visibleStartLine || line > this.visibleEndLine;
	}

	shiftToVisibleLine(line, visibleStartLine) {
		return line - visibleStartLine;
	}
}
