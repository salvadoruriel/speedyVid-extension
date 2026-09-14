//popup  logic
document.addEventListener('DOMContentLoaded', async function () {
	let data
	try{
		data = await chrome.storage.local.get('spyvi_speed');
	}catch(error){
		console.error("[spyvi] Error reading from storage:", error);
	}
	let spyvi_speed = data.spyvi_speed ?? 1.0
	let speedSlider = document.getElementById('speed-slider');
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
			speedDisplay.textContent = speed.toFixed(2);
			//save speed
			chrome.storage.local.set({spyvi_speed: speed}).then(() => {
				console.log("saved speed")
			})
		});
	}

});
