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

function Score() {
  this.value = 0;
}

const circleSizes = {
  small: {size: 100, color: '#2670b3'},
  medium: {size: 150, color: '#e91e38'},
  big: {size: 200, color: '#ff7458'}
};

var sound = new UserSound(0);
var score = new Score();

$('#counter').text(score.value);
generateComputerCirlce()

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
  playGame(soundMeter)
}

function useMic(mic) {
  mic.connectToSource(stream, function(e) {
    if (e) {
      alert(e);
      return;
    }

    listen(mic);
    applyGameRules();

  });
}

function listen(mic) {
  var shortTime = setInterval(function() {
    if (mic.instant.toFixed(2) > sound.loudestVolume) {
      sound.loudestVolume = mic.instant.toFixed(2);
    }
    var diameter = sound.loudestVolume * 320;
    $('#user-circle').width(diameter).height(diameter);
  }, 100);
}

function applyGameRules() {
  setInterval(function() {
    if(sound.loudestVolume * 320 >= $('#computer-circle').width()) {
      score.value++;
      sound.loudestVolume = 0;
      $('#counter').text(score.value);
      generateComputerCirlce();
    } else {
      sound.loudestVolume = 0;
      generateComputerCirlce();
    }
  }, 3000)
}

function generateComputerCirlce() {
  $('#computer-circle').removeClass('small-circle');
  $('#computer-circle').removeClass('medium-circle');
  $('#computer-circle').removeClass('big-circle');
  switch(Math.floor(Math.random() * 4)) {
    case 0:
      $('#computer-circle').addClass('small-circle');
      break;
    case 1:
      $('#computer-circle').addClass('medium-circle');
      break;
    case 2:
      $('#computer-circle').addClass('big-circle');
      break;
    default:
      $('#computer-circle').addClass('small-circle');
  }
}


function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function playGame(sound) {
  console.log(useMic(sound));
}

function stopListening() {
  soundMeter.stop();
}

function startListening() {
  console.log(useMic(soundMeter));

}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
