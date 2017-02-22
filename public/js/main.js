'use strict';

var instantMeter = document.querySelector('#instant meter');
var instantValueDisplay = document.querySelector('#instant .value');
var canvas = document.querySelector('#myCanvas');
var ctx = canvas.getContext("2d");

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
      var size = mic.instant.toFixed(2) * 70
      drawCircle(size);
    }, 400);
  });
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function stopListening() {
  soundMeter.stop();
  soundMeter.instant = 0.00
  instantMeter.value = instantValueDisplay.innerText = soundMeter.instant.toFixed(2);
}

function startListening() {
  useMic(soundMeter);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

function drawCircle(size) {
  clear(ctx);
  ctx.beginPath();
  ctx.arc(100,75,size,0,2*Math.PI);
  ctx.stroke();
}

function clear(c) {
    c.clearRect(0, 0, 600, 300);
}
