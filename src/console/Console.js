import {getCircularReplacer} from './Utils.js';

let style = `
.console {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;

  color: white;
  font-family: monospace;
  -webkit-text-stroke-width: 0.5px;
  -webkit-text-stroke-color: black;
}

.console-input {
  background: rgba(0,0,0,0.7);
  width: 100%;
  border: 0px;
  padding: 10px;
  text-indent: 26px;
}

.console-input:read-write:focus {
  outline: none;
}

.console-input::before {
  content: "$";
  left: -14px;
  position: absolute;
}

.console-fps {
  position: fixed;
  display: block;
  right: 0px;
  top: 0px;
  padding: 10px;
}

.console-output {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.console-output-log,
.console-output-info,
.console-output-warn,
.console-output-error {
  padding: 10px;
  width: calc(100% - 20px);
  overflow-wrap: break-word;
}

.console-output-log span {
  background: rgba(0, 0, 0, 0.4);
}

.console-output-log {
  color: #eeeeee;
}

.console-output-error {
  color: #ff8080;
}

.console-output-warn {
  color: #ffe65e;
}

.console-output-info {
  color: #71f2ff;
}

.console-output__trace {
  padding-left: 20px;
  padding-top: 10px;
}
`;
let consoleStyle = document.createElement('style');
consoleStyle.type = "text/css";
consoleStyle.innerHTML = style;
document.body.appendChild(consoleStyle);

let capturedConsole = [];
let pressedKeys = {};


let consoleElement = document.createElement('div');
consoleElement.className = 'console';
consoleElement.style.display = 'none';
let fpsElement = document.createElement('div');
fpsElement.className = 'console-fps';
fpsElement.innerText = "";
let consoleOutputElement = document.createElement('div');
consoleOutputElement.className = 'console-output';
let consoleInputFocused = false;
let consoleInput = document.createElement('div');
consoleInput.contentEditable = "true";
consoleInput.setAttribute('spellcheck', 'false');
consoleInput.setAttribute('autocorrect', 'off');
consoleInput.setAttribute('autocapitalize', 'off');
consoleInput.className = 'console-input';
consoleInput.innerHTML = '<br>';
consoleInput.onblur = () => {
  consoleInputFocused = false;
};
consoleInput.onclick = () => {
  consoleInputFocused = true;
};
consoleElement.appendChild(consoleInput);
consoleElement.appendChild(consoleOutputElement);
consoleElement.appendChild(fpsElement);
document.body.appendChild(consoleElement);

let isConsoleOutputShowing = false;
let toggleConsoleOuputDisplay = () => {
  isConsoleOutputShowing = !isConsoleOutputShowing;
  document.querySelector('.console').style.display = isConsoleOutputShowing ? 'block' : 'none';
}

let toggleConsoleFocus = () => {
  if (!consoleInputFocused) {
    consoleInputFocused = true;
    document.querySelector('.console-input').focus(); 
  } else {
    document.querySelector('.console-input').blur();
  }
}


let evalHistory = [`console.info("hello - world")`];
let evalHistoryIndex = 0;
let renderHistory = (direction) => {
  if (!consoleInputFocused) {
    return;
  }
  evalHistoryIndex += direction;
  let text = "";
  if (evalHistoryIndex < evalHistory.length && evalHistoryIndex > -1) {
    text = evalHistory[evalHistoryIndex];
  } else {
    evalHistoryIndex = Math.max(Math.min(evalHistoryIndex, evalHistory.length), -1);
  }
  document.querySelector('.console-input').innerHTML = text;
}

let evalInput = () => {
  try {
    const text = document.querySelector('.console-input').innerText;
    if (text == 'clear') {
      capturedConsole = [];
      renderConsole();
    } else {
      evalHistory.push(text);
      evalHistoryIndex = evalHistory.length;
      console.log(window.eval(text));  
    }
  } catch (error) {
    console.error(error);
  }
  setTimeout(() => {
    document.querySelector('.console-input').innerHTML = '<br>';
  }, 1);
}

let lastTime = window.performance.now();
let fpsArr = [];
let fpsIndex = 0;
export const updateFPS = () => {
  let fps =  Math.ceil(1000 / (window.performance.now() - lastTime));
  fpsIndex ++;
  if (fpsIndex == 60) {
    fpsIndex = 0;
  }

  fpsArr[fpsIndex] = fps;
  if (fpsArr.length === 60) {
    let avgFps = Math.ceil(fpsArr.reduce((prev, curr) => {
      return curr + prev;
    }, 0) / 60);
    document.querySelector('.console-fps').innerText = "FPS: " + (avgFps);
  }
  lastTime = window.performance.now();
}

document.addEventListener('keydown', function(event) {
  pressedKeys[event.code] = true; // Add the physical key code
  
  // Check for Ctrl + S combination on keydown
  if (pressedKeys['ControlLeft'] && pressedKeys['KeyK'] && pressedKeys['KeyC']) {
    toggleConsoleFocus();
  } else  if (pressedKeys['ControlLeft'] && pressedKeys['KeyK']) {
    toggleConsoleOuputDisplay();
  } 
  if (isConsoleOutputShowing) {
    if (!pressedKeys['ShiftLeft'] && pressedKeys['Enter']) {
      evalInput();
    } else if (pressedKeys['ArrowUp']) {
      renderHistory(-1);
    } else if (pressedKeys['ArrowDown']) {
      renderHistory(1);
    } 
  }
});

document.addEventListener('keyup', function(event) {
  pressedKeys[event.code] = false; // Remove the released key
});

let updateConsole = function(type, args, trace) {
  if (capturedConsole.length >= 10) {
    capturedConsole.pop();
  }
  capturedConsole.push({
    time: new Date().valueOf(),
    type: type, 
    args: Array.from(args),
    trace: trace,
    // stack: arguments['callee'].stack
  });
  renderConsole();
}

let renderConsole = () => {
  const consoleOutput = document.querySelector('.console-output');
  document.querySelector('.console-output').innerHTML = "";
  capturedConsole.sort((a, b) => {
    return b.time - a.time
  }).map(log => {
    const elem = document.createElement("div");
    elem.className = "console-output-" + log.type;
    elem.innerHTML = '<span>' + JSON.stringify(log.args, getCircularReplacer()) + '</span>';
    if (log.trace) {
      elem.innerHTML += '<div class="console-output__trace">' + log.trace.join('<br>') + '</div>'; 
    }
    return elem;
  }).forEach(elem => {
    consoleOutput.appendChild(elem);
  });
}

function getStackTrace () {
  let stack;

  try {
    throw new Error('');
  }
  catch (error) {
    stack = error.stack || '';
  }

  stack = stack.split('\n').map(function (line) { return line.trim(); });
  return stack.splice(stack[0] == 'Error' ? 3 : 2);
}

let originalLog = console.log;
console.log = function(args) {
  const trace = getStackTrace();
  updateConsole("log", arguments, trace);
  originalLog.apply(console, arguments); // Call the original console.log
};


let originalWarn = console.warn;
console.warn = function(message) {
  const trace = getStackTrace();
  updateConsole("warn", arguments, trace);
  originalWarn.apply(console, arguments); // Call the original console.log
};

let originalError = console.error;
console.error = function(message) {
  const trace = getStackTrace();
  updateConsole("error", arguments, trace);
  originalError.apply(console, arguments); // Call the original console.log
};

let originalInfo = console.info;
console.info = function(message) {
  const trace = getStackTrace();
  updateConsole("info", arguments, trace);
  originalInfo.apply(console, arguments); // Call the original console.log
};

// let originalWindowError = window.onerror;
window.onerror = function(message) {
  const trace = getStackTrace();
  updateConsole("error", arguments, trace);
  // originalWindowError.apply(console, arguments); // Call the original console.log
};
