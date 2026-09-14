const KEY = 'spyvi_speed';


//popup  logic
document.addEventListener('DOMContentLoaded', async function () {
	let data
	try{
		data = await chrome.storage.local.get(KEY);
	}catch(error){
		console.error("[spyvi] Error reading from storage:", error);
	}
	let spyvi_speed = data.spyvi_speed ?? 1.0
	let speedSlider = document.getElementById('speed-slider');
	speedSlider.value = spyvi_speed.toFixed(2);
	let speedDisplay = document.getElementById('current-speed');
	speedDisplay.textContent = spyvi_speed.toFixed(2);
	let speedButtons = document.getElementById('speed-buttons');

	// draw speed buttons
	for (let i = 0.75; i <= 2.75; i += 0.25) {
		let button = document.createElement('button');
		button.textContent = i.toFixed(2);
		button.addEventListener('click', function () {
			setSpeed(i);
		});
		speedButtons.appendChild(button);
	}

	speedSlider.addEventListener('input', function () {
		setSpeed(parseFloat(speedSlider.value));
	});

	function setSpeed(speed) {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { action: "setSpeed", speed: speed });

			//save speed
			chrome.storage.local.set({spyvi_speed: speed}).then(() => {
				console.log("saved speed")
			})
		});
	}
});


//Updating displays of values on & while Open
const updSpeedDisplays = (speed) => {
	const speedSlider = document.getElementById('speed-slider');
	const speedDisplay = document.getElementById('current-speed');
	if(!speedSlider){
		console.warn("speed-slider not available yet");
		return;
	}
	speedSlider.value = speed.toFixed(2);
	speedDisplay.textContent = speed.toFixed(2);
}

(async () => {
  try {
		const res = await chrome.storage.local.get(KEY);
		const cachedSpeed = res[KEY] ?? 1.0;
		updSpeedDisplays(cachedSpeed);
		//console.info("[spyvi] Loaded cache")
  } catch (err) {
    console.error('[spyvi] Interval: Storage read failed:', err);
  }
})();

//While open
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[KEY]) {
    const cachedSpeed = changes[KEY].newValue ?? 1.0;
		updSpeedDisplays(cachedSpeed);
  	console.info('[spyvi] Cache updated:', cachedSpeed);
  }
});