// Constants
const INITIAL_LEVEL = 1;
const INITIAL_FAIL_TIMEOUT = 3000;
const LEVEL_INTERVAL = 500;
const LEVEL_TIME_INCREMENT = 100;
const CUBE_DIMENSIONS = 60;

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
    resetLevel();
    $('#message').text(`Level ${currentLevel}, you have ${failTimeout / 1000} seconds!`);

    // Create new cubes according to level
    for (let i = 0; i < level; i++) {
        createCube();
    }
    setTimer();
}

function createCube() {
    // Create new cube
    const newCube = $('<i class="fas fa-plane"></i>');
    newCube.addClass('random');

    newCube.click(function () {
        cubeCounter++;
        $(this).addClass('clicked');
        newCube.css('color', 'gray');
        $(this).off('click');
        checkLevelPass();
    });

    // Randomize position, color & rotation
    const randomPosition = getRandomPosition();
    newCube.css('left', randomPosition.x);
    newCube.css('top', randomPosition.y);
    newCube.css('color', getRandomColor());
    newCube.css('transform', `rotate(${getRandomDegree()})`);

    // Attach cube to container
    newCube.appendTo('#cube-container').fadeIn(700);
}

function getRandomPosition() {
    const x = Math.floor((Math.random() * ($('#cube-container').width() - CUBE_DIMENSIONS)));
    const y = Math.floor((Math.random() * ($('#cube-container').height() - CUBE_DIMENSIONS)));
    return { x, y };
}

function getRandomColor() {
    return `rgb(${(Math.floor(Math.random() * 256))}, 
        ${(Math.floor(Math.random() * 256))}, ${(Math.floor(Math.random() * 256))})`;
}

function getRandomDegree() {
    return `${Math.floor(Math.random() * 360)}deg`;
}

function checkLevelPass() {
    // Each click increments the counter, check if we've reached the required clicks to pass the level
    if (cubeCounter === currentLevel) {
        failTimeout += LEVEL_TIME_INCREMENT;
        startLevel(++currentLevel);
    }
}

function failLevel(level) {
    // Notify the user and show buttons to proceed
    $('#cube-container').children().each(function () {
        $(this).addClass('fail');
        $(this).off('click');
    });
    $('#message').text(`You failed level ${level}!`);
    $('#retry').css('visibility','visible').click(() => startLevel(level));
    $('#reset').css('visibility','visible').click(() => resetGame());
}

function setTimer() {
    clearTimeout(timer);
    timer = setTimeout(function () {
        failLevel(currentLevel);
    }, failTimeout);
}

function resetLevel() {
    $('#retry').css('visibility','hidden').off('click');
    $('#reset').css('visibility','hidden').off('click');
    $('#cube-container').empty();
    $('#message').text('');
    cubeCounter = 0;
}

function resetGame() {
    currentLevel = INITIAL_LEVEL;
    failTimeout = INITIAL_FAIL_TIMEOUT;
    startLevel(currentLevel);
}