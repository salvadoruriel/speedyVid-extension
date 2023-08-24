//reads events
chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		//setSpeed
		if (request.action === "setSpeed") {
			let videoElements = Array.from(document.getElementsByTagName('video'));
			//console.log('%c Vids found','color: yellow',videoElements)

			//Update speed on all video elements
			videoElements.forEach((video) => {
				video.playbackRate = request.speed;

				// Create or update speed indicator
				let speedIndicator = video.parentElement.querySelector('.speed-indicator');
				if (!speedIndicator) {
					speedIndicator = document.createElement('div');
					speedIndicator.style.position = 'absolute';
					speedIndicator.style.top = '0';
					speedIndicator.style.left = '0';
					speedIndicator.style.backgroundColor = 'gray';
					speedIndicator.style.opacity = '0.5';
					speedIndicator.style.borderRadius = '5px';
					speedIndicator.classList.add('speed-indicator');
					video.parentElement.appendChild(speedIndicator);
				}
				speedIndicator.textContent = request.speed.toFixed(2);
			});
		} 
	}
);
