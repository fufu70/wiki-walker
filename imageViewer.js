const ImageViewer = ((source) => {
	const CLASS_NAME = "image-viewer__image";


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
	
	const view = function(source) {
		if (document.querySelector(`.${CLASS_NAME}`)) {
			return;
		}

		document.addEventListener("keydown", handleEscape);

		console.log("VIEW IMAGE", source);

		const img = document.createElement("div")
		img.className = CLASS_NAME;
		img.style.height = "100vh"
		img.style.width = "100vw"
		img.style.zIndex = 1000
		img.style.position = "fixed"
		img.style.top = "0px"
		img.style.left = "0px";
		img.style.background = "black";
		img.style.backgroundImage = `url("${source}")`;
		img.style.backgroundSize = "contain";
		img.style.backgroundPosition = "center";
		img.style.backgroundRepeat = "no-repeat";
		document.body.appendChild(img);

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
			window.ImageViewer.close();
		}
		img.appendChild(cls);
	}

	return {
		view: view,
		close: close
	}
});
window.ImageViewer = ImageViewer();
