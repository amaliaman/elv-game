// Constants
const INITIAL_LEVEL = 1;
const INITIAL_FAIL_TIMEOUT = 3000;
const LEVEL_INTERVAL = 500;
const LEVEL_TIME_INCREMENT = 100;

// Global variables
let failTimeout = INITIAL_FAIL_TIMEOUT;
let currentLevel = INITIAL_LEVEL;
let cubeCounter = 0;
let timer;

// Run after document loads
$(document).ready(function () {
    startLevel(currentLevel);
});

function startLevel(level) {
    // If we're not on start - pause for a bit before redrawing cubes
    let levelInterval = 0;
    if (level > 1) {
        levelInterval = LEVEL_INTERVAL;
    }

    setTimeout(() => {
        resetLevel();
        $('#message').text(`Level ${currentLevel}, you have ${failTimeout / 1000} seconds!`);

        // Create new cubes according to level
        for (let i = 0; i < level; i++) {
            createCube();
        }
    }, levelInterval);

    setTimer();
}

function createCube() {
    // Create new cube
    const newCube = $('<div>');
    newCube.addClass('cube');
    newCube.click(function () {
        cubeCounter++;
        $(this).addClass('clicked');
        $(this).unbind('click');
        checkLevelPass();
    });

    // Attach cube to container
    $('#cube-container').append(newCube);
}

function checkLevelPass() {
    // Each click increments the counter, check if we've reached the required clicks to pass the level
    if (cubeCounter == currentLevel) {
        failTimeout += LEVEL_TIME_INCREMENT;
        startLevel(++currentLevel);
    }
}

function failLevel(level) {
    // Notify the user and show buttons to proceed
    $('#cube-container > .cube').each(function () { 
        $(this).addClass('fail');
        $(this).unbind('click');
      });
    $('#message').text(`You failed level ${level} 😱`);
    $('#retry').show().click(() => startLevel(level));
    $('#reset').show().click(() => resetGame());
}

function setTimer() {
    clearTimeout(timer);
    timer = setTimeout(function () {
        failLevel(currentLevel);
    }, failTimeout);
}

function resetLevel() {
    $('#retry').hide();
    $('#reset').hide();
    $('#cube-container').empty();
    $('#message').text('');
    cubeCounter = 0;
}

function resetGame() {
    currentLevel = INITIAL_LEVEL;
    failTimeout = INITIAL_FAIL_TIMEOUT;
    startLevel(currentLevel);
}