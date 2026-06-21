let style = `
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

.network-viewer-output table th {
	border: 0px;
	text-align: center;
	position: sticky;
	top: 0;
}
.network-viewer-output-log {
  padding: 10px;
  width: calc(100% - 20px);
  overflow-wrap: break-word;
}

.network-viewer-output th,
.network-viewer-output-log td {
  background: rgba(0, 0, 0, 0.4);
}

.network-viewer-output-log {
  color: #eeeeee;
}

.network-viewer-output-error {
  color: #ff8080;
}

.network-viewer-output-warn {
  color: #ffe65e;
}

.network-viewer-output-info {
  color: #71f2ff;
}
`;
let networkViewerStyle = document.createElement('style');
networkViewerStyle.type = "text/css";
networkViewerStyle.innerHTML = style;
document.body.appendChild(networkViewerStyle);

let capturedConsole = [];
let pressedKeys = {};

let networkElement = document.createElement('div');
networkElement.className = 'network-viewer';
networkElement.style.display = 'none';
let networkOutputElement = document.createElement('div');
networkOutputElement.className = 'network-viewer-output';
let networkInputFocused = false;
let networkInput = document.createElement('div');
networkInput.contentEditable = "true";
networkInput.setAttribute('spellcheck', 'false');
networkInput.setAttribute('autocorrect', 'off');
networkInput.setAttribute('autocapitalize', 'off');
networkInput.className = 'network-viewer-input';
networkInput.innerHTML = '<br>';
networkInput.onblur = () => {
  networkInputFocused = false;
};
networkInput.onclick = () => {
  networkInputFocused = true;
};
networkElement.appendChild(networkInput);
networkElement.appendChild(networkOutputElement);
document.body.appendChild(networkElement);

let isNetworkOutputShowing = false;
let toggleNetworkOuputDisplay = () => {
  isNetworkOutputShowing = !isNetworkOutputShowing;
  document.querySelector('.network-viewer').style.display = isNetworkOutputShowing ? 'block' : 'none';
}

let toggleNetworkFocus = () => {
  if (!networkInputFocused) {
    networkInputFocused = true;
    document.querySelector('.network-viewer-input').focus(); 
  } else {
    document.querySelector('.network-viewer-input').blur();
  }
}


let evalHistory = [`index.html`];
let evalHistoryIndex = 0;
let renderNetworkHistory = (direction) => {
  if (!networkInputFocused) {
    return;
  }
  evalHistoryIndex += direction;
  let text = "";
  if (evalHistoryIndex < evalHistory.length && evalHistoryIndex > -1) {
    text = evalHistory[evalHistoryIndex];
  } else {
    evalHistoryIndex = Math.max(Math.min(evalHistoryIndex, evalHistory.length), -1);
  }
  document.querySelector('.network-viewer-input').innerHTML = text;
}

let evalNetworkInput = () => {
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

let getEncodedSize = (size) => {
	if (size < 1000)
		return size + " B";
	if (size < (1000 * 1000))
		return (size/(1000)).toFixed(2) + " KB";
	if (size < (1000 * 1000 * 1000))
		return (size/(1000 * 1000)).toFixed(2) + " MB";
	if (size < (1000 * 1000 * 1000 * 1000))
		return (size/(1000 * 1000 * 1000)).toFixed(2) + " GB";
}

let renderNetworkOutputRow = (entry) => {
	let c = 'network-viewer-output-log';
	
	if (entry.responseStatus == 0) {
		c += ' network-viewer-output-warn';
	} else if (entry.responseStatus >= 400) {
		c += ' network-viewer-output-error';
	} else if (entry.responseStatus != 200) {
		c += ' network-viewer-output-info';
	} 

	let l = `<tr class="${c}">`;
	l += '<td>' + entry.responseStatus + '</td>';
	l += '<td>' + entry.name + '</td>';
	l += '<td>' + entry.contentType + '</td>';
	l += '<td>' + getEncodedSize(entry.encodedBodySize) + '</td>';
	l += '</tr>';
	return l;
}

let networkHistory = [];
let renderNetworkViewerOutput = () => {
	let innerHTML = '<table>';
	innerHTML += '<tr>';
	innerHTML += '<th>Status</th>';
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
