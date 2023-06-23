//popup js
document.addEventListener('DOMContentLoaded', function () {
	let speedSlider = document.getElementById('speed-slider');
	let currentSpeedDisplay = document.getElementById('current-speed');
	let speedButtons = document.getElementById('speed-buttons');

	// Initialize speed buttons
	for (let i = 0.75; i <= 2.25; i += 0.25) {
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
			currentSpeedDisplay.textContent = speed.toFixed(2);
		});
	}

	// Set initial speed
	setSpeed(1);
});
