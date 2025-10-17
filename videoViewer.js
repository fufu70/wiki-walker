const VideoViewer = ((sources) => {
	const CLASS_NAME = "video-viewer__video";


	const handleEscape = function(e) {
		if (e.key === 'Escape') {
			close();
		}
	};

	const close = function() {
		const videoWrapper = document.querySelector(`.${CLASS_NAME}`);
		videoWrapper.remove();
		document.removeEventListener("keydown", handleEscape);
	}
	
	const view = function(sources) {
		if (document.querySelector(`.${CLASS_NAME}`)) {
			return;
		}

		document.addEventListener("keydown", handleEscape);

		console.log("VIEW VIDEO", sources);

		const videoWrapper = document.createElement("div")
		videoWrapper.className = CLASS_NAME;
		videoWrapper.style.height = "100vh"
		videoWrapper.style.width = "100vw"
		videoWrapper.style.zIndex = 1000
		videoWrapper.style.position = "fixed"
		videoWrapper.style.top = "0px"
		videoWrapper.style.left = "0px";
		videoWrapper.style.background = "black";
		document.body.appendChild(videoWrapper);

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
			window.VideoViewer.close();
		}
		videoWrapper.appendChild(cls);

		const video = document.createElement("video");
		video.style.position = "absolute";
		video.style.top = "40px";
		video.style.left = "40px";
		video.style.height = "calc(100vh - 80px)";
		video.style.width = "calc(100vw - 80px)";
		video.autoplay = true;
		video.controls = true;
		let innerHTML = "";
		sources.forEach(source => {
			const urlParts = source.split(".");
			const type = urlParts[urlParts.length - 1];
			innerHTML += `
				<source src="${source}" type="video/${type}">
			`;
		})
		video.innerHTML = innerHTML;
		videoWrapper.appendChild(video);
	}

	return {
		view: view,
		close: close
	}
});
window.VideoViewer = VideoViewer();
