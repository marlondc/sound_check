'use strict';

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

function UserSound(initialVolume) {
  this.averageVolume = initialVolume;
  this.totalVolume = initialVolume;
  this.loudestVolume = initialVolume;
}

var sound = new UserSound(0);

console.log(sound);
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
      if (mic.instant.toFixed(2) > sound.loudestVolume) {
        sound.loudestVolume = mic.instant.toFixed(2);
      }
      diameter = sound.loudestVolume * 200
      var diameter = sound.loudestVolume * 200;
      // $('#circle').css('width', diameter);
      // $('#circle').css('height', diameter);
      $('#user-circle').width(diameter).height(diameter);
    }, 100);
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
