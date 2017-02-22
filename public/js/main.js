'use strict';

var instantMeter = document.querySelector('#instant meter');
var noiseCounter = document.querySelector('#noise_counter');
var noiseCounterValue = 0
var instantValueDisplay = document.querySelector('#instant .value');

try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: true,
  video: false
};

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
  useMic(soundMeter);
}

function useMic(mic) {
  mic.connectToSource(stream, function(e) {
    if (e) {
      alert(e);
      return;
    }
    setInterval(function() {
      if (mic.instant.toFixed(2) > 0.50) {
        noiseCounterValue += 1;
      }
      instantMeter.value = instantValueDisplay.innerText =
          mic.instant.toFixed(2);
      noiseCounter.innerText = noiseCounterValue;
    }, 200);
  });
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function stopListening() {
  soundMeter.stop();
  noiseCounterValue = 0;
  noiseCounter.innerText = noiseCounterValue;
}

function startListening() {
  useMic(soundMeter);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
