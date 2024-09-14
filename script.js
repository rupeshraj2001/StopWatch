let lastTick = null;
let newTimer = true;
let timerRunning = false;
let loop;
let timerTick = 0;
let pauseTS = 0;
let unPauseTS = 0;
let pauseDifference = 0;
const log = console.log.bind(console);

function pad(val) {
  // "pad" the number with an extra zero
  return val > 9 ? val : "0" + val;
}

function padMilli(val) {
  // "pad" the number with a extra zero's
  return val < 1 ? "000" :
    val >= 1 && val < 10 ? "00" + val :
    val > 9 && val < 100 ? "0" + val :
    val;
}

function timeStr(val) {
  /*Minutes*/
  return (
    "<div class='spacer'>" +
    pad(parseInt(val / 60000, 10).toFixed(0)) +
		"</div><div class='spacer'>" +
    " : " +
		"</div><div class='spacer'>" +
    /*Seconds*/
    pad(parseInt((val / 1000) % 60, 10)) +
		"</div><div class='spacer'>" +
    " : " +
		"</div><div class='spacer'>" +
    /*HundredSeconds*/
    padMilli(val % 1000) +
		"</div>"
  )
}

function tick(timestamp) {
  lastTick = lastTick == null ? timestamp : lastTick;
  const delta = newTimer == true ? 0 : timestamp - pauseDifference - lastTick;
  lastTick = timestamp - pauseDifference;
  timerTick += delta;
  document.querySelector("#timer").innerHTML = timeStr(timerTick.toFixed(0));
  loop = requestAnimationFrame(tick);
}

document.querySelector("#start_pause").addEventListener("click", function() {
  let timerState = {
    [
      [true, false]
    ]: startTimer,
    [
      [false, false]
    ]: resumeTimer,
    [
      [false, true]
    ]: pauseTimer
  };

  function startTimer() {
    loop = requestAnimationFrame(tick);
    timerRunning = true;
    newTimer = false;
  }

  function resumeTimer() {
    timerRunning = true;
    unPauseTS = performance.now();
    pauseDifference += unPauseTS - pauseTS;
    loop = requestAnimationFrame(tick);
  }

  function pauseTimer() {
    timerRunning = false;
    pauseTS = performance.now();
    cancelAnimationFrame(loop);
  }
  timerState[[newTimer, timerRunning]]();
});

document.querySelector("#restart").addEventListener("click", function() {
  newTimer = true;
  timerRunning = false;
  lastTick = null;
  cancelAnimationFrame(loop);
  timerTick = 0;
  pauseTS = 0;
  unPauseTS = 0;
  pauseDifference = 0;
  document.querySelector("#timer").innerHTML = 	`
			<div class="spacer">00</div>
	    <div class="spacer"> : </div>
  	  <div class="spacer">00</div>
    	<div class="spacer"> : </div>
    	<div class="spacer">000</div>
	`;
});
