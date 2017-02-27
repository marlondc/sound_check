'use strict';

var canvas = document.querySelector('#myCanvas');
var ctx = canvas.getContext("2d");


// jquery

var paper, circs, i, nowX, nowY, timer, props = {}, toggler = 0, elie, dx, dy, rad, cur, opa;
// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function ran(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveIt()
{
    for(i = 0; i < circs.length; ++i)
    {
          // Reset when time is at zero
        if (! circs[i].time)
        {
            circs[i].time  = ran(30, 100);
            circs[i].deg   = ran(-179, 180);
            circs[i].vel   = ran(1, 5);
            circs[i].curve = ran(0, 1);
            circs[i].fade  = ran(0, 1);
            circs[i].grow  = ran(-2, 2);
        }
            // Get position
        nowX = circs[i].attr("cx");
        nowY = circs[i].attr("cy");
           // Calc movement
        dx = circs[i].vel * Math.cos(circs[i].deg * Math.PI/180);
        dy = circs[i].vel * Math.sin(circs[i].deg * Math.PI/180);
            // Calc new position
        nowX += dx;
        nowY += dy;
            // Calc wrap around
        if (nowX < 0) nowX = 490 + nowX;
        else          nowX = nowX % 490;
        if (nowY < 0) nowY = 490 + nowY;
        else          nowY = nowY % 490;

            // Render moved particle
        circs[i].attr({cx: nowX, cy: nowY});

            // Calc growth
        rad = circs[i].attr("r");
        if (circs[i].grow > 0) circs[i].attr("r", Math.min(30, rad +  .1));
        else                   circs[i].attr("r", Math.max(10,  rad -  .1));

            // Calc curve
        if (circs[i].curve > 0) circs[i].deg = circs[i].deg + 2;
        else                    circs[i].deg = circs[i].deg - 2;

            // Calc opacity
        opa = circs[i].attr("fill-opacity");
        if (circs[i].fade > 0) {
            circs[i].attr("fill-opacity", Math.max(.3, opa -  .01));
            circs[i].attr("stroke-opacity", Math.max(.3, opa -  .01)); }
        else {
            circs[i].attr("fill-opacity", Math.min(1, opa +  .01));
            circs[i].attr("stroke-opacity", Math.min(1, opa +  .01)); }

        // Progress timer for particle
        circs[i].time = circs[i].time - 1;

            // Calc damping
        if (circs[i].vel < 1) circs[i].time = 0;
        else circs[i].vel = circs[i].vel - .05;

    }
    timer = setTimeout(moveIt, 60);
}

function drawCircles(numberOfCircles, paper, circs) {
  paper.clear();
  for (i = 0; i < numberOfCircles; ++i)
  {
      opa = ran(3,10)/10;
      circs.push(paper.circle(ran(0,500), ran(0,500), ran(10,30)).attr({"fill-opacity": opa,
                                                                     "stroke-opacity": opa}));
  }
  circs.attr({fill: "#00DDAA", stroke: "#00DDAA"});
  moveIt();
}

window.onload = function () {
  paper = Raphael("canvas", 500, 500);
  circs = paper.set();
};

// jquery

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
      var size = mic.instant.toFixed(2);
      showCircle(size * 80);
      checkCircles(size);
    }, 100);
  });
}

function checkCircles(noiseLevel) {
  console.log('=======');
  console.log(noiseLevel);
  console.log('=======');
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

function showCircle(size) {
  clear(ctx);
  ctx.beginPath();
  ctx.arc(100,75,size,0,2*Math.PI);
  ctx.stroke();
}

function clear(c) {
    c.clearRect(0, 0, 600, 300);
}
