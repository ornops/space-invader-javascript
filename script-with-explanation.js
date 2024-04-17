const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202; // Initialize the index of the shooter
const width = 15; // Width of the grid
const aliensRemoved = []; // Array to keep track of removed aliens
let invadersId; // Variable to hold the ID of the setInterval function for moving invaders
let isGoingRight = true; // Variable to keep track of the direction invaders are moving
let direction = 1; // Variable to control the direction of invaders
let results = 0; // Initialize the variable to keep track of the score

// Create grid squares
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.id = i;
    grid.appendChild(square);
}
const squares = Array.from(document.querySelectorAll(".grid div")); // Select all grid squares

// Define the positions of alien invaders
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

// Function to draw alien invaders on the grid
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader");
        }
    }
}
draw(); // Call the draw function to initially draw the invaders
squares[currentShooterIndex].classList.add('shooter'); // Draw the shooter on the grid

// Function to remove invaders from the grid
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

// Function to move the shooter
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

// Event listener to move the shooter
document.addEventListener('keydown', moveShooter);

// Function to move the invaders
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove(); // Remove invaders from their current positions

    if (rightEdge && isGoingRight) { // Check if invaders have reached the right edge and moving right
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1; // Move invaders down and change direction
            direction = -1;
            isGoingRight = false;
        }
    }
    if (leftEdge && !isGoingRight) { // Check if invaders have reached the left edge and moving left
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1; // Move invaders down and change direction
            direction = 1;
            isGoingRight = true;
        }
    }
    for (let i = 0; i < alienInvaders.length; i++) {
       alienInvaders[i] += direction; // Move invaders horizontally
    }
    draw(); // Redraw invaders at their new positions

    // Check if the shooter has collided with an invader
    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"; // Display game over message
        clearInterval(invadersId); // Stop the game loop
    }

    // Check if all aliens are removed
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"; // Display win message
        clearInterval(invadersId); // Stop the game loop
    }
}

invadersId = setInterval(moveInvaders, 1000); // Call moveInvaders function repeatedly at intervals

// Function to shoot lasers
function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser"); // Remove laser from its current position
        currentLaserIndex -= width; // Move laser up
        squares[currentLaserIndex].classList.add("laser"); // Add laser to its new position

        // Check if laser hits an invader
        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser"); // Remove laser
            squares[currentLaserIndex].classList.remove("invader"); // Remove invader
            squares[currentLaserIndex].classList.add("boom"); // Add explosion effect

            // Remove explosion effect after a delay
            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);

            clearInterval(laserId); // Stop the laser movement
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved); // Add removed invader to the array
            results++; // Increment score
            resultDisplay.innerHTML = results; // Update score display
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100); // Call moveLaser function repeatedly at intervals
    }
}

// Event listener to shoot lasers
document.addEventListener("keydown", shoot);
