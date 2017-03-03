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
  small: {size: 50, color: '#2670b3'},
  medium: {size: 75, color: '#e91e38'},
  big: {size: 100, color: '#ff7458'}
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
    resetGame(mic);

  });
}

function listen(mic) {
  var shortTime = setInterval(function() {
    if (mic.instant.toFixed(2) > sound.loudestVolume) {
      sound.loudestVolume = mic.instant.toFixed(2);
    }
    var diameter = sound.loudestVolume * 160;
    document.getElementById('user-circle').setAttribute("r", diameter);
  }, 100);
}

function applyGameRules() {
  setInterval(function() {
    if(sound.loudestVolume * 160 >= $('#computer-circle').width()) {
      score.value++;
      sound.loudestVolume = 0;
      $('#counter').text(score.value);
      generateComputerCirlce();
      clearInterval();
    } else {
      sound.loudestVolume = 0;
      generateComputerCirlce();
      clearInterval();
    }
  }, 3000)
}

function resetGame(mic) {
  setInterval(function() {
    listen(mic)
  }, 5000)
}

function generateComputerCirlce() {
  switch(Math.floor(Math.random() * 4)) {
    case 0:
      document.getElementById('computer-circle').setAttribute("r", circleSizes.small.size);
      $('#computer-circle').css({fill: circleSizes.small.color});
      break;
    case 1:
      document.getElementById('computer-circle').setAttribute("r", circleSizes.medium.size);
      $('#computer-circle').css({fill: circleSizes.medium.color});

      break;
    case 2:
      document.getElementById('computer-circle').setAttribute("r", circleSizes.big.size);
      $('#computer-circle').css({fill: circleSizes.big.color});

      break;
    default:
      document.getElementById('computer-circle').setAttribute("r", circleSizes.small.size);
      $('#computer-circle').css({fill: circleSizes.small.color});

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
