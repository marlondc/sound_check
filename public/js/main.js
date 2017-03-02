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

const circleSizes = {
  small: {size: 100, color: '#2670b3'},
  medium: {size: 150, color: '#e91e38'},
  big: {size: 200, color: '#ff7458'}
};

var score = 0;
var sound = new UserSound(0);

$('#counter').text(score);


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
