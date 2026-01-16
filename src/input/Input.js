 export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

import {MobileInput} from './MobileInput.js';


export class Input {
	static mobileInput = undefined;

	constructor(SUPPORTED_CHARACTERS = "") {
		this.heldDirections = [];
		this.keys = {};
		this.lastKeys = {};

		this.lastTextKeys = [];

		document.addEventListener("keydown", (e) => {

			if (e.key === 'Escape' || e.key === 'Enter') {
				e.preventDefault();
			}

			this.keys[e.code] = true;
			if (SUPPORTED_CHARACTERS.indexOf(e.key) > -1) {
				this.lastTextKeys.push(e.key);
			}

			if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.onArrowPressed(LEFT);
			}
			if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.onArrowPressed(RIGHT);
			}
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.onArrowPressed(UP);
			}
			if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.onArrowPressed(DOWN);
			}
		});


		document.addEventListener("keyup", (e) => {
			this.keys[e.code] = false;
			
			if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.onArrowReleased(LEFT);
			}
			if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.onArrowReleased(RIGHT);
			}
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.onArrowReleased(UP);
			}
			if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.onArrowReleased(DOWN);
			}
			if (e.code === "f") {
				this.onFullscreenReleased();
			}
		});
		this.isFullscreen = false;

		const mobileParams = {
			leftPressed: () => {
				this.onArrowPressed(LEFT)
			},
			rightPressed: () => {
				this.onArrowPressed(RIGHT)
			},
			upPressed: () => {
				this.onArrowPressed(UP)
			},
			downPressed: () => {
				this.onArrowPressed(DOWN)
			},
			leftReleased: () => {
				this.onArrowReleased(LEFT)
			},
			rightReleased: () => {
				this.onArrowReleased(RIGHT)
			},
			upReleased: () => {
				this.onArrowReleased(UP)
			},
			downReleased: () => {
				this.onArrowReleased(DOWN)
			},
			aPressed: () => {
				this.keys['Space'] = true;
				this.lastTextKeys.push('Space');
			},
			bPressed: () => {
				this.keys['Enter'] = true;
				this.lastTextKeys.push('Enter');
			},
			xPressed: () => {
				this.keys['Escape'] = true;
				this.lastTextKeys.push('Escape');
				// this.
			},
			yPressed: () => {
				this.keys['ShiftLeft'] = true;
				this.lastTextKeys.push('ShiftLeft');
				// this.
			},
			aReleased: () => {
				this.keys['Space'] = false;
			},
			bReleased: () => {
				this.keys['Enter'] = false;
			},
			xReleased: () => {
				this.keys['Escape'] = false;
			},
			yReleased: () => {
				this.keys['ShiftLeft'] = false;
				// this.
			},
		};

		if (this.showTouchpad() && Input.mobileInput === undefined) {
			Input.mobileInput = new MobileInput(mobileParams);
		} else if (this.showTouchpad() && Input.mobileInput !== undefined) {
			Input.mobileInput.applyParams(mobileParams);
		}
	}

	get direction() {
		return this.heldDirections[0];
	}

	update() {
		this.lastKeys = {... this.keys};
	}

	clearKeyboardText() {
		this.lastTextKeys = [];
	}

	getKeyboardText() {
		const text = this.lastTextKeys.join("");
		this.clearKeyboardText();
		return text;
	}

	getActionJustPressed(keyCode) {
		let justPressed = false;
		if (this.keys[keyCode] && !this.lastKeys[keyCode]) {
			justPressed = true;
		}
		return justPressed;
	}

	getActionHeld(keyCode) {
		return this.keys[keyCode];
	}

	onArrowPressed(direction) {
		if (this.heldDirections.indexOf(direction) === -1) {
			this.heldDirections.unshift(direction);
		}
	}

	onArrowReleased(direction) {

		const index = this.heldDirections.indexOf(direction);

		if (index === -1) {
			return;
		}

		this.heldDirections.splice(index, 1);
	}


	onFullscreenReleased() {
		const elem = document.querySelector('canvas');
		this.isFullscreen = !this.isFullscreen;
		if (this.isFullscreen) {
			this.openFullscreen(elem);
		} else {
			this.closeFullscreen(elem);
		}
	}

	openFullscreen(elem) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}
	}

	closeFullscreen(elem) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}

	showTouchpad() {
		return this.isMobile() || this.isTablet();
	}

	isMobile() {
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}
	isTablet() {
		if(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test((navigator.userAgent||navigator.vendor||window.opera).toLowerCase()))
			return true;
		return false;
	}
}
