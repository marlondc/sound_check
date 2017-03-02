'use strict';

var instantMeter = document.querySelector('#instant meter');
var slowMeter = document.querySelector('#slow meter');
var clipMeter = document.querySelector('#clip meter');

var instantValueDisplay = document.querySelector('#instant .value');
var slowValueDisplay = document.querySelector('#slow .value');
var clipValueDisplay = document.querySelector('#clip .value');

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
      instantMeter.value = instantValueDisplay.innerText =
          mic.instant.toFixed(2);
      slowMeter.value = slowValueDisplay.innerText =
          mic.slow.toFixed(2);
      clipMeter.value = clipValueDisplay.innerText =
          mic.clip;
      var diameter = mic.instant.toFixed(2) * 200;
      console.log(diameter);
      // $('#circle').css('width', diameter);
      // $('#circle').css('height', diameter);
      $('#circle').width(diameter).height(diameter);
    }, 1000);
  });
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function stopListening() {
  soundMeter.stop();
}

function startListening() {
  useMic(soundMeter);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
