// Constants
const INITIAL_LEVEL = 1;
const INITIAL_FAIL_TIMEOUT = 3000;
const LEVEL_INTERVAL = 500;
const LEVEL_TIME_INCREMENT = 100;
const CUBE_DIMENSIONS = 60;
const COUNTDOWN_INTERVAL = 100;

// Global variables
let _failTimeout = INITIAL_FAIL_TIMEOUT;
let _currentLevel = INITIAL_LEVEL;
let _timer;
let _countdown;
let _levelCountdownIdGlob;
let _cubeCounter = 0;

// Start the game
startLevel(_currentLevel);


/* ==================== Functions ==================== */

function startLevel(level) {
    resetLevel();

    $('#message').html(`Level <span id="level-number">${_currentLevel}</span> - you have <span id="remaining-time">${_failTimeout / 1000}</span> seconds!`);

    // Create new cubes according to level
    for (let i = 0; i < level; i++) {
        createCube();
    }
    setTimer();

    // Start level countdown
    _countdown = _failTimeout;
    const levelCountdownId = setInterval(levelCountdown, COUNTDOWN_INTERVAL);
    _levelCountdownIdGlob = levelCountdownId;
}

function levelCountdown() {
    _countdown -= COUNTDOWN_INTERVAL;
    const num = _countdown / 1000;
    $('#remaining-time').text(num.toFixed(1));
}

function stopLevelCountdown() {
    clearInterval(_levelCountdownIdGlob);
}

function createCube() {
    // Create new cube
    const $newCube = $('<i class="fas fa-plane random"></i>');

    // Attach event listeners to cubes
    $newCube.click(function () {
        _cubeCounter++;
        $(this).addClass('clicked');
        $(this).css('color', 'gray');
        $(this).off('click');
        checkLevelPass();
    });

    // Randomize position, color & rotation
    const randomPosition = getRandomPosition();
    $newCube.css({
        left: randomPosition.x,
        top: randomPosition.y,
        color: getRandomColor(),
        transform: `rotate(${getRandomDegree()})`
    });

    // Attach cube to container
    $newCube.appendTo('#cube-container').fadeIn(700);
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
    if (_cubeCounter === _currentLevel) {
        _failTimeout += LEVEL_TIME_INCREMENT;
        startLevel(++_currentLevel);
    }
}

function failLevel(level) {
    stopLevelCountdown();

    $('#cube-container').children().off().addClass('fail');

    // Notify the user and show buttons to proceed
    $('#message').text(`You failed level ${level}!`);
    $('#retry').css('visibility', 'visible').click(() => startLevel(level));
    $('#reset').css('visibility', 'visible').click(() => resetGame());
}

function setTimer() {
    clearTimeout(_timer);
    _timer = setTimeout(function () {
        failLevel(_currentLevel);
    }, _failTimeout);
}

function resetLevel() {
    $('#retry').css('visibility', 'hidden').off();
    $('#reset').css('visibility', 'hidden').off();
    $('#cube-container').empty();
    $('#message').text('');
    _cubeCounter = 0;
    stopLevelCountdown();
}

function resetGame() {
    _currentLevel = INITIAL_LEVEL;
    _failTimeout = INITIAL_FAIL_TIMEOUT;
    startLevel(_currentLevel);
}