var style = `
.network-viewer {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;

  color: white;
  font-family: monospace;
  -webkit-text-stroke-width: 0.25px;
  -webkit-text-stroke-color: black;
}

.network-viewer-input {
  background: rgba(0,0,0,0.7);
  width: 100%;
  border: 0px;
  padding: 10px;
  text-indent: 26px;
}

.network-viewer-input:read-write:focus {
  outline: none;
}

.network-viewer-input::before {
  content: "🔍	";
  left: -14px;
  position: absolute;
}

.network-viewer-output {
  width: 100%;
  height: 100%;
	overflow-y: scroll;
}

.network-viewer-output table {
	padding: 10px;
	margin-bottom: 30px;
	min-width: 100%;
}

.network-viewer-output-log {
  padding: 10px;
  width: calc(100% - 20px);
  overflow-wrap: break-word;
}

.network-viewer-output-log span {
  background: rgba(0, 0, 0, 0.4);
}

.network-viewer-output-log {
  color: #eeeeee;
}
`;
var networkViewerStyle = document.createElement('style');
networkViewerStyle.type = "text/css";
networkViewerStyle.innerHTML = style;
document.body.appendChild(networkViewerStyle);

var capturedConsole = [];
let pressedKeys = {};

var networkElement = document.createElement('div');
networkElement.className = 'network-viewer';
networkElement.style.display = 'none';
var networkOutputElement = document.createElement('div');
networkOutputElement.className = 'network-viewer-output';
var inputFocused = false;
var input = document.createElement('div');
input.contentEditable = "true";
input.setAttribute('spellcheck', 'false');
input.setAttribute('autocorrect', 'off');
input.setAttribute('autocapitalize', 'off');
input.className = 'network-viewer-input';
input.innerHTML = '<br>';
input.onblur = () => {
  this.inputFocused = false;
};
input.onclick = () => {
  this.inputFocused = true;
};
networkElement.appendChild(input);
networkElement.appendChild(networkOutputElement);
document.body.appendChild(networkElement);

var isNetworkOutputShowing = false;
var toggleNetworkOuputDisplay = () => {
  isNetworkOutputShowing = !isNetworkOutputShowing;
  document.querySelector('.network-viewer').style.display = isNetworkOutputShowing ? 'block' : 'none';
}

var toggleNetworkFocus = () => {
  if (!inputFocused) {
    inputFocused = true;
    document.querySelector('.network-viewer-input').focus(); 
  } else {
    document.querySelector('.network-viewer-input').blur();
  }
}


var evalHistory = [`index.html`];
var evalHistoryIndex = 0;
var renderNetworkHistory = (direction) => {
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
  document.querySelector('.network-viewer-input').innerHTML = text;
}

var evalNetworkInput = () => {
  try {
    const text = document.querySelector('.network-viewer-input').innerText;
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
    document.querySelector('.network-viewer-input').innerHTML = '<br>';
  }, 1);
}

document.addEventListener('keydown', function(event) {
  pressedKeys[event.code] = true; // Add the physical key code
  
  if (pressedKeys['ControlLeft'] && pressedKeys['KeyL'] && pressedKeys['KeyC']) {
    toggleNetworkFocus();
  } else  if (pressedKeys['ControlLeft'] && pressedKeys['KeyL']) {
    toggleNetworkOuputDisplay();
  } 
  if (isNetworkOutputShowing) {
    if (pressedKeys['Enter']) {
      evalNetworkInput();
    } else if (pressedKeys['ArrowUp']) {
      renderNetworkHistory(-1);
    } else if (pressedKeys['ArrowDown']) {
      renderNetworkHistory(1);
    } 
  }
});
document.addEventListener('keyup', function(event) {
  pressedKeys[event.code] = false; // Remove the released key
});

var renderNetworkOutputRow = (entry) => {
	var l = '<tr class="network-viewer-output-log">';
	l += '<td>' + entry.nextHopProtocol + '</td>';
	l += '<td>' + entry.name + '</td>';
	l += '<td>' + entry.contentType + '</td>';
	l += '<td>' + entry.encodedBodySize + '</td>';
	l += '</tr>';
	return l;
}

var networkHistory = [];
var renderNetworkViewerOutput = () => {
	let innerHTML = '<table>';
	innerHTML += '<tr>';
	innerHTML += '<th>Next Hop Protocol</th>';
	innerHTML += '<th>URL</th>';
	innerHTML += '<th>Content Type</th>';
	innerHTML += '<th>Size</th>';
	innerHTML += '</tr>';
	// show the network history in inverse order
	for (let i = networkHistory.length - 1; i >= 0; i --) {
		innerHTML += renderNetworkOutputRow(networkHistory[i]);
	}

	innerHTML += '</table>';
	networkOutputElement.innerHTML = innerHTML;
}

const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
		if (entry.initiatorType === 'other') return;
		networkHistory.push(entry);
  });
	renderNetworkViewerOutput();
});

// Start observing, including historical requests that occurred before the observer was created
observer.observe({ type: "resource", buffered: true });
