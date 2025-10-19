var style = `
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
  text-indent: 20px;
}

.console-input:read-write:focus {
  outline: none;
}

.console-input::before {
  content: "$";
  left: -8px;
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
var consoleStyle = document.createElement('style');
consoleStyle.type = "text/css";
consoleStyle.innerHTML = style;
document.body.appendChild(consoleStyle);

var capturedConsole = [];
let pressedKeys = {};


var consoleElement = document.createElement('div');
consoleElement.className = 'console';
consoleElement.style.display = 'none';
var fpsElement = document.createElement('div');
fpsElement.className = 'console-fps';
fpsElement.innerText = "";
var consoleOutputElement = document.createElement('div');
consoleOutputElement.className = 'console-output';
var inputFocused = false;
var input = document.createElement('div');
input.contentEditable = "true";
input.setAttribute('spellcheck', 'false');
input.setAttribute('autocorrect', 'off');
input.setAttribute('autocapitalize', 'off');
input.className = 'console-input';
input.innerHTML = '<br>';
input.onblur = () => {
  this.inputFocused = false;
};
input.onclick = () => {
  this.inputFocused = true;
};
consoleElement.appendChild(input);
consoleElement.appendChild(consoleOutputElement);
consoleElement.appendChild(fpsElement);
document.body.appendChild(consoleElement);

var isConsoleOutputShowing = false;
var toggleConsoleOuputDisplay = () => {
  isConsoleOutputShowing = !isConsoleOutputShowing;
  document.querySelector('.console').style.display = isConsoleOutputShowing ? 'block' : 'none';
}

var toggleConsoleFocus = () => {
  if (!inputFocused) {
    inputFocused = true;
    document.querySelector('.console-input').focus(); 
  } else {
    document.querySelector('.console-input').blur();
  }
}


var evalHistory = [`console.info("hello - world")`];
var evalHistoryIndex = 0;
var renderHistory = (direction) => {
  if (!inputFocused) {
    return;
  }
  evalHistoryIndex += direction;
  var text = "";
  if (evalHistoryIndex < evalHistory.length && evalHistoryIndex > -1) {
    text = evalHistory[evalHistoryIndex];
  } else {
    evalHistoryIndex = Math.max(Math.min(evalHistoryIndex, evalHistory.length), -1);
  }
  document.querySelector('.console-input').innerHTML = text;
}

var evalInput = () => {
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

var lastTime = window.performance.now();
var fpsArr = [];
var fpsIndex = 0;
export const updateFPS = () => {
  var fps =  Math.ceil(1000 / (window.performance.now() - lastTime));
  fpsIndex ++;
  if (fpsIndex == 60) {
    fpsIndex = 0;
  }

  fpsArr[fpsIndex] = fps;
  if (fpsArr.length === 60) {
    var avgFps = Math.ceil(fpsArr.reduce((prev, curr) => {
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

var updateConsole = function(type, args, trace) {
  capturedConsole.push({
    time: new Date().valueOf(),
    type: type, 
    args: Array.from(args),
    trace: trace,
    // stack: arguments['callee'].stack
  });
  renderConsole();
}

var getCircularReplacer = function() {
  const ancestors = [];
  return function (key, value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return "[Circular]";
    }
    ancestors.push(value);
    return value;
  };
}

var renderConsole = () => {
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
  var stack;

  try {
    throw new Error('');
  }
  catch (error) {
    stack = error.stack || '';
  }

  stack = stack.split('\n').map(function (line) { return line.trim(); });
  return stack.splice(stack[0] == 'Error' ? 3 : 2);
}

var originalLog = console.log;
console.log = function(args) {
  const trace = getStackTrace();
  updateConsole("log", arguments, trace);
  originalLog.apply(console, arguments); // Call the original console.log
};


var originalWarn = console.warn;
console.warn = function(message) {
  const trace = getStackTrace();
  updateConsole("warn", arguments, trace);
  originalWarn.apply(console, arguments); // Call the original console.log
};

var originalError = console.error;
console.error = function(message) {
  const trace = getStackTrace();
  updateConsole("error", arguments, trace);
  originalError.apply(console, arguments); // Call the original console.log
};

var originalInfo = console.info;
console.info = function(message) {
  const trace = getStackTrace();
  updateConsole("info", arguments, trace);
  originalInfo.apply(console, arguments); // Call the original console.log
};

// var originalWindowError = window.onerror;
window.onerror = function(message) {
    updateConsole("error", arguments, trace);
    // originalWindowError.apply(console, arguments); // Call the original console.log
};
