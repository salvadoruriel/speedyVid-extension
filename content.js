const KEY = 'spyvi_speed';
const INTERVAL_MS = 1000;
// Initial read
let cachedSpeed = 1.0;
(async () => {
  try {
		const res = await chrome.storage.local.get(KEY);
		cachedSpeed = res[KEY] ?? 1.0;
		//console.info("[spyvi] Loaded cache")
  } catch (err) {
    console.error('[spyvi] Interval: Storage read failed:', err);
  }
})();

//read speed changes in storage, could replace event listener but not for now
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[KEY]) {
    cachedSpeed = changes[KEY].newValue ?? 1.0;
    console.info('[spyvi] Cache updated:', cachedSpeed);
  }
});

const drawUpdSpeedIndicator = (videoEl, speed) => {
	let speedIndicator = videoEl.parentElement.querySelector('.speed-indicator');
	if (!speedIndicator) {
		speedIndicator = document.createElement('div');
		speedIndicator.style.position = 'absolute';
		speedIndicator.style.top = '0';
		speedIndicator.style.left = '0';
		speedIndicator.style.backgroundColor = 'gray';
		speedIndicator.style.opacity = '0.5';
		speedIndicator.style.borderRadius = '5px';
		speedIndicator.classList.add('speed-indicator');
		videoEl.parentElement.appendChild(speedIndicator);
	}
	speedIndicator.textContent = speed.toFixed(2);
}
const setSpeed = (speed) => {
	let videoElements = Array.from(document.getElementsByTagName('video'));
	//console.log('%c Vids found','color: yellow',videoElements)

	videoElements.forEach((videoEl) => {
		videoEl.playbackRate = speed;//set speed

		drawUpdSpeedIndicator(videoEl, speed);
		let spdind = videoEl.parentElement.querySelector('.speed-indicator');
		if(!spdind){
			console.warn("Speed indicator not added, possible error")
		}
	})
}
const recheckSpeed = (speed) => {
	let videoElements = Array.from(document.getElementsByTagName('video'));
	videoElements.every((video) => {
		const tmp = video.playbackRate;
		if(tmp != speed){
			setSpeed(speed);
			console.info(`[spyvi] updated video speed ${tmp} -> ${speed}`);
			return false;
		}
	});
}

//ensurer
setInterval (() => {
	recheckSpeed(cachedSpeed);
}, INTERVAL_MS); 

//Event listener
chrome.runtime.onMessage.addListener(
	(request, sender, sendResponse) => {
		if (request.action === "setSpeed") {
			setSpeed(request.speed)
		}
		else if (request.action === "recheckSpeed") {
			recheckSpeed(request.speed);
		}
	}
);

