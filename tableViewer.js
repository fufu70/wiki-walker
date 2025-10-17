const TableViewer = ((table) => {
	const CLASS_NAME = "table-viewer__table";

	const handleEscape = function(e) {
		if (e.key === 'Escape') {
			close();
		}
	};

	const close = function() {
		const img = document.querySelector(`.${CLASS_NAME}`);
		img.remove();
		document.removeEventListener("keydown", handleEscape);
	}

	const addTableStyle = function() {
		var style = `
.${CLASS_NAME} table {
	width: calc(100vw - 110px);
	height: calc(100vh - 110px);
	background: rgba(0, 0, 0, 0.5);
	overflow-y: scroll;
  	position: relative;
	display: block;
	top: 55px;
	left: 55px;

	color: white;
	font-family: monospace;
	-webkit-text-stroke-width: 0.5px;
	-webkit-text-stroke-color: black;

	border-top-style: ridge;
	border-bottom-style: ridge;
	border-left-style: ridge;
	border-right-style: ridge;
	border-color: white;
	border-width: 3px;
}

.${CLASS_NAME} td, th {
	border-right: solid 1px white ;
    border-bottom: 1px solid white;
    text-align: center;
}
`;
		var consoleStyle = document.createElement('style');
		consoleStyle.type = "text/css";
		consoleStyle.innerHTML = style;
		document.body.appendChild(consoleStyle);
	}

	const generateHeader = function(table) {
		const tr = document.createElement("tr");
		const headerColumns = Object.keys(table[0]);
		headerColumns.map(header => {
			const th = document.createElement("th");
			th.innerHTML = header;
			tr.appendChild(th);
		});
		const thead = document.createElement("thead");
		thead.appendChild(tr);
		return thead;
	}	

	const generateRow = function(row) {
		const tr = document.createElement("tr");
		Object.keys(row).map(column => {
			const td = document.createElement("td");
			td.innerHTML = row[column];
			tr.appendChild(td);
		});
		return tr;
	}

	const generateTableBody = function(table) {
		const tbody = document.createElement("tbody");
		table.map(row => {
			tbody.appendChild(generateRow(row));
		});
		return tbody;
	}

	const generateTable = function(table) {
		const htmlTable = document.createElement("table");
		htmlTable.appendChild(generateHeader(table));
		htmlTable.appendChild(generateTableBody(table));
		return htmlTable;
	}
	
	const view = function(table) {
		if (document.querySelector(`.${CLASS_NAME}`)) {
			return;
		}

		document.addEventListener("keydown", handleEscape);

		console.log("VIEW Table", table);

		const tableWrapper = document.createElement("div")
		tableWrapper.className = CLASS_NAME;
		tableWrapper.style.height = "100vh"
		tableWrapper.style.width = "100vw"
		tableWrapper.style.zIndex = 1000
		tableWrapper.style.position = "fixed"
		tableWrapper.style.top = "0px"
		tableWrapper.style.left = "0px";
		tableWrapper.style.background = "black";
		tableWrapper.style.overflow = "scroll";
		document.body.appendChild(tableWrapper);

		const cls = document.createElement("div");
		cls.innerHTML = "✕";
		cls.style.position = "absolute";
		cls.style.top = "15px";
		cls.style.right = "15px";
		cls.style.fontSize = "25px";
		cls.style.color = "white";
		cls.style.cursor = "pointer";
		// -webkit-text-stroke-width: 1px;
		// -webkit-text-stroke-color: black;
		cls.onclick = function() {
			window.TableViewer.close();
		}
		tableWrapper.appendChild(cls);
		tableWrapper.appendChild(generateTable(table));
	}

	return {
		view: view,
		close: close,
		addTableStyle: addTableStyle
	}
});
window.TableViewer = TableViewer();
window.TableViewer.addTableStyle();
