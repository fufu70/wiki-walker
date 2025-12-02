const style = `
html, body {
  overscroll-behavior-y: none; /* Disables pull-to-refresh and overscroll glow effect vertically */
  overscroll-behavior: none; /* Shorthand for both x and y */
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /*  touch-action: none;*/
  -webkit-text-size-adjust: none;
  touch-action: manipulation;
}

.mobile-controller {
  opacity: 0.7;
  position: fixed;
  z-index: 2;
/*  background: #000000aa;*/
  height: 100vh;
  width: 100vw;
  left: 0;
  bottom: 0;
}

.mobile-controller-arrow-pad {
  position: absolute;
  left: 30px;
/*  background: #ff0000aa;*/
  height: 350px;
  width: 350px;
}

.mobile-controller-arrow-up {
  rotate: -90deg;
  position: absolute;
  top: 70px; /*19%*/
  left: 122px; /* 35% */
}

.mobile-controller-arrow-down {
  rotate: 90deg;
  position: absolute;
  bottom: 60px; /*19%*/
  left: 122px; /* 35% */
}

.mobile-controller-arrow-left {
  rotate: 180deg;
  position: absolute;
  top: 140px; /*40% */
  left: 56px; /*16% */
}

.mobile-controller-arrow-right {
  position: absolute;
  top: 140px; /*40% */
  right: 56px; /*16% */
}

.mobile-controller-arrow {
  background: white;
  border-top: 5px solid black;
  border-bottom: 5px solid black;
  border-right: 5px solid black;
  width: 100px; /* 350px */
  height: 60px; /* 350px */
  position: relative;
  left: 35px; /* 350px */
  maring-top: 10px;
}

.mobile-controller-triangle {
  width: 0; 
  height: 0; 
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-right:30px solid white;
  position: absolute;
  left: -30px;
  top: 0px;
}

.mobile-controller-background-triangle {
  width: 0; 
  height: 0; 
  border-top: 35px solid transparent;
  border-bottom: 35px solid transparent;
  border-right: 35px solid black;
  position: absolute;
  left: -35px;
  top: -5px;
}

.mobile-controller-action-pad {
  position: absolute;
  right: 30px;
/*  background: #00ff00aa;        */
  height: 350px;
  width: 350px;
  font-size: 40px;
  color: black;
  font-family: monospace;
  -webkit-text-stroke-width: 0.5px;
  -webkit-text-stroke-color: black;
}

.mobile-controller-action-button {
  width: 80px;
  height: 80px;
  background: white;
  line-height: 80px;
  text-align: center;
  border-radius: 60px;
  border: 5px solid black;
}


.mobile-controller-action-pad-a {
  position: absolute;
  top: 133px;
  right: 46px;
}

.mobile-controller-action-pad-b {
  position: absolute;
  bottom: 35px;
  left: 129px;
}

.mobile-controller-action-pad-x {
  position: absolute;
  top: 133px;
  left: 46px;
}

.mobile-controller-action-pad-y {
  position: absolute;
  top: 35px;
  left: 129px;
}
`;

const template = `
<div class="mobile-controller">
  <div class="mobile-controller-arrow-pad" draggable="false">
    <div class="mobile-controller-arrow-up">
      <div class="mobile-controller-arrow">
        <div class="mobile-controller-background-triangle"></div>
        <div class="mobile-controller-triangle"></div>
      </div>
    </div>
    <div class="mobile-controller-arrow-down">
      <div class="mobile-controller-arrow">
        <div class="mobile-controller-background-triangle"></div>
        <div class="mobile-controller-triangle"></div>
      </div>
    </div>
    <div class="mobile-controller-arrow-left">
      <div class="mobile-controller-arrow">
        <div class="mobile-controller-background-triangle"></div>
        <div class="mobile-controller-triangle"></div>
      </div>
    </div>
    <div class="mobile-controller-arrow-right">
      <div class="mobile-controller-arrow">
        <div class="mobile-controller-background-triangle"></div>
        <div class="mobile-controller-triangle"></div>
      </div>
    </div>
  </div>
  <div class="mobile-controller-action-pad">
    <div class="mobile-controller-action-button mobile-controller-action-pad-a">
      A
    </div>
    <div class="mobile-controller-action-button mobile-controller-action-pad-b">
      B
    </div>
    <div class="mobile-controller-action-button mobile-controller-action-pad-x">
      X
    </div>
    <div class="mobile-controller-action-button mobile-controller-action-pad-y">
      Y
    </div>
  </div>
</div>
`;

export class MobileInput {
	constructor(params) {
		this.params = params;
		this.params.disableDoubleClick = this.params.disableDoubleClick ?? true;
		this.addStyle();
		this.addTemplate();

		this.applyDynamicStyles();
		this.attachActions(this.params);
	}

	applyParams(params) {
		params.disableDoubleClick = params.disableDoubleClick ?? true;
		this.attachActions(params);
	}

	addStyle() {
		var styleElem = document.createElement('style');
		styleElem.type = "text/css";
		styleElem.innerHTML = style;
		document.body.appendChild(styleElem);
	}

	addTemplate() {
		var templateElem = document.createElement('div');
		templateElem.innerHTML = template;
		document.body.appendChild(templateElem);
	}

	applyDynamicStyles() {
		const limit = 200 / 17;
		const append = "rem";
		const triangleSize = (30 / 350) * limit;
		const border = 5 / 17;
		const triangleSizeBackground = triangleSize + border;


		const height = limit;
		const width = limit;
		document.querySelectorAll('.mobile-controller-arrow-pad').forEach(elem => {
			elem.style.height = height + append;
			elem.style.width = width + append;
		});
		document.querySelectorAll('.mobile-controller-arrow-up').forEach(elem => {
			elem.style.top = ((70 / 350) * limit) + append;
			elem.style.left = ((122 / 350) * limit) + append;
		});
		document.querySelectorAll('.mobile-controller-arrow-down').forEach(elem => {
			elem.style.bottom = ((60 / 350) * limit) + append;
			elem.style.left = ((122 / 350) * limit) + append;
		});
		document.querySelectorAll('.mobile-controller-arrow-left').forEach(elem => {
			elem.style.top = ((140 / 350) * limit) + append;
			elem.style.left = ((56 / 350) * limit) + append;
		});
		document.querySelectorAll('.mobile-controller-arrow-right').forEach(elem => {
			elem.style.top = ((140 / 350) * limit) + append;
			elem.style.right = ((56 / 350) * limit) + append;
		});

		document.querySelectorAll('.mobile-controller-arrow').forEach(elem => {
			elem.style.width = ((100 / 350) * limit) + append;
			elem.style.height = ((60 / 350) * limit) + append;
			elem.style.left = ((35 / 350) * limit) + append;
		});
		document.querySelectorAll('.mobile-controller-triangle').forEach(elem => {

			elem.style.borderTopWidth = triangleSize + append;
			elem.style.borderBottomWidth = triangleSize + append;
			elem.style.borderRightWidth = triangleSize + append;
			elem.style.left = "-" + (triangleSize - 0.175) + append;
		});
		document.querySelectorAll('.mobile-controller-background-triangle').forEach(elem => {
			elem.style.borderTopWidth = triangleSizeBackground + append;
			elem.style.borderBottomWidth = triangleSizeBackground + append;
			elem.style.borderRightWidth = triangleSizeBackground + append;
			elem.style.left = "-" + triangleSizeBackground + append;
			elem.style.top = "-" + border + append;
		});

		document.querySelectorAll('.mobile-controller-action-pad').forEach(elem => {
			elem.style.right = ((30 / 350) * limit) + append;
			elem.style.height = ((350 / 350) * limit) + append;
			elem.style.width = ((350 / 350) * limit) + append;
			elem.style.fontSize = ((40 / 350) * limit) + append;
		});

		document.querySelectorAll('.mobile-controller-action-button').forEach(elem => {
			elem.style.width = ((80 / 350) * limit) + append;
			elem.style.height = ((80 / 350) * limit) + append;
			elem.style.lineHeight = ((80 / 350) * limit) + append;
			elem.style.borderRadius = ((60 / 350) * limit) + append;
			elem.style.borderWidth = border + append;
		});


		document.querySelectorAll('.mobile-controller-action-pad-a').forEach(elem => {
			elem.style.top = ((133/ 350) * limit) + append;
			elem.style.right = ((46/ 350) * limit) + append;
		});

		document.querySelectorAll('.mobile-controller-action-pad-b').forEach(elem => {
			elem.style.bottom = ((35/ 350) * limit) + append;
			elem.style.left = ((129/ 350) * limit) + append;
		});

		document.querySelectorAll('.mobile-controller-action-pad-x').forEach(elem => {
			elem.style.top = ((133/ 350) * limit) + append;
			elem.style.left = ((46/ 350) * limit) + append;
		});

		document.querySelectorAll('.mobile-controller-action-pad-y').forEach(elem => {
			elem.style.top = ((35/ 350) * limit) + append;
			elem.style.left = ((129/ 350) * limit) + append;
		});
	}

	isInElement(event, element) {
		let isIn = false;
        const elementBox = element.getBoundingClientRect();
		for (let i = 0; i < event.touches.length; i ++) {
			const touch = event.touches[i];
	        const eventX = touch.clientX; 
	        const eventY = touch.clientY;

	        isIn = (eventX >= elementBox.left && eventX <= elementBox.right)
	          && (eventY >= elementBox.top && eventY <= elementBox.bottom);
          	if (isIn) {
          		return true;
          	}
		}

		return false;
    }

    handleArrowPad(e, params) {
        if (!e.touches || e.touches.length == 0) {
          return;
        }
        const upArrow = document.querySelector('.mobile-controller-arrow-up');
        const downArrow = document.querySelector('.mobile-controller-arrow-down');
        const leftArrow = document.querySelector('.mobile-controller-arrow-left');
        const rightArrow = document.querySelector('.mobile-controller-arrow-right');

        const isUpPressed = this.isInElement(e, upArrow);
		const isDownPressed = this.isInElement(e, downArrow);
		const isLeftPressed = this.isInElement(e, leftArrow);
		const isRightPressed = this.isInElement(e, rightArrow);

        if (isUpPressed) {
        	params.upPressed();
        } else {
        	params.upReleased();
        }
		if (isDownPressed) {
			params.downPressed();
		} else {
			params.downReleased();
		}
		if (isLeftPressed) {
			params.leftPressed();
		} else {
			params.leftReleased();
		}
		if (isRightPressed) {
			params.rightPressed();
		} else {
			params.rightReleased();
		}
    }

	handleActionPad(e, params) {
		if (!e.touches || e.touches.length == 0) {
			return;
		}
		const actionA = document.querySelector('.mobile-controller-action-pad-a');
		const actionB = document.querySelector('.mobile-controller-action-pad-b');
		const actionX = document.querySelector('.mobile-controller-action-pad-x');
		const actionY = document.querySelector('.mobile-controller-action-pad-y');

		const isAPressed = this.isInElement(e, actionA);
		const isBPressed = this.isInElement(e, actionB);
		const isXPressed = this.isInElement(e, actionX);
		const isYPressed = this.isInElement(e, actionY);

		if (isAPressed) {
			params.aPressed();
		} else {
			params.aReleased();
		}
		if (isBPressed) {
			params.bPressed();
		} else {
			params.bReleased();
		}
		if (isXPressed) {
			params.xPressed();
		} else {
			params.xReleased();
		}
		if (isYPressed) {
			params.yPressed();
		} else {
			params.yReleased();
		}
	}
      

	attachActions(params) {
      	document.querySelector('.mobile-controller-arrow-pad').addEventListener("touchstart", e => {
			this.handleArrowPad(e, params);
		});
      	document.querySelector('.mobile-controller-arrow-pad').addEventListener("touchmove", e => {
			this.handleArrowPad(e, params);
		});
      	document.querySelector('.mobile-controller-arrow-pad').addEventListener("touchend", e => {
			this.handleArrowPad(e, params);
        	params.upReleased();
			params.downReleased();
			params.leftReleased();
			params.rightReleased();
		});

      	document.querySelector('.mobile-controller-action-pad').addEventListener("touchstart", e => {
			this.handleActionPad(e, params);
		});
      	document.querySelector('.mobile-controller-action-pad').addEventListener("touchmove", e => {
			this.handleActionPad(e, params);
		});
      	document.querySelector('.mobile-controller-action-pad').addEventListener("touchend", e => {
			this.handleActionPad(e, params);
        	params.aReleased();
			params.bReleased();
			params.xReleased();
			params.yReleased();
		});

		if (params.disableDoubleClick) {
			document.ondblclick = function(e) {
				e.preventDefault();
			}
		}
	}
}