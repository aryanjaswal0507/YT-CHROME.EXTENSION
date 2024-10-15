document.addEventListener('DOMContentLoaded', function () {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const bassSlider = document.getElementById('bassSlider');
    const bassValue = document.getElementById('bassValue');

    // Function to adjust volume and bass on YouTube
    function adjustAudio(volume, bass) {
        // Get the current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0]; // Get the active tab

            chrome.scripting.executeScript({
                target: { tabId: activeTab.id }, // Use activeTab.id here
                func: (volume, bass) => {
                    const video = document.querySelector('video');
                    if (video) {
                        video.volume = volume / 100; // Adjust volume

                        // Create an Audio Context for bass adjustment
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        const source = audioContext.createMediaElementSource(video);
                        const bassBoost = audioContext.createBiquadFilter();
                        bassBoost.type = 'lowshelf';
                        bassBoost.frequency.value = 200; // Adjust frequency for bass
                        bassBoost.gain.value = bass - 50; // Adjust gain based on slider value

                        // Connect the nodes
                        source.connect(bassBoost);
                        bassBoost.connect(audioContext.destination);
                    }
                },
                args: [volume, bass]
            });
        });
    }

    // Update volume value
    volumeSlider.addEventListener('input', function () {
        volumeValue.textContent = this.value;
        adjustAudio(this.value, bassSlider.value);
    });

    // Update bass value
    bassSlider.addEventListener('input', function () {
        bassValue.textContent = this.value;
        adjustAudio(volumeSlider.value, this.value);
    });
});