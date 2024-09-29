// Function to add the paint canvas to the LeetCode page
function addPaintCanvas() {
    console.log("Attempting to add paint canvas...");

    const canvas = document.createElement('canvas');
    canvas.id = 'leetpaint-canvas';
    canvas.style.border = '2px solid #FFA116';  // LeetCode's orange-yellow color
    canvas.width = window.innerWidth - 50; // Adjust canvas size
    canvas.height = 400; // Canvas height
    canvas.style.marginTop = '20px';

    // Append the canvas to a specific part of the page
    const mainContent = document.querySelector('.description__24sA');
    if (mainContent) {
        mainContent.appendChild(canvas);
        console.log("Canvas added to main content");
    } else {
        // If main content is not found, append the canvas to the body
        document.body.appendChild(canvas);
        console.log("Canvas added to body as fallback");
    }

    // Initialize the canvas for painting
    initializePaintCanvas(canvas);
}

// Initialize the paint canvas
function initializePaintCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let painting = false;

    // Adjust for canvas offset
    const getMousePos = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    // Start drawing when the mouse is pressed
    function startPosition(e) {
        painting = true;
        draw(e); // Start drawing immediately when the mouse is pressed
    }

    // Stop drawing when the mouse is released
    function endPosition() {
        painting = false;
        ctx.beginPath(); // Reset the path to avoid connecting lines after lifting the mouse
    }

    // Draw on the canvas
    function draw(e) {
        if (!painting) return;

        const mousePos = getMousePos(canvas, e);

        ctx.lineWidth = 5;           // Line thickness
        ctx.lineCap = 'round';       // Round edges for smoother strokes
        ctx.strokeStyle = '#000000'; // Black paint

        ctx.lineTo(mousePos.x, mousePos.y); // Draw line to current mouse position
        ctx.stroke(); // Apply stroke

        ctx.beginPath(); // Begin a new path to avoid line joins
        ctx.moveTo(mousePos.x, mousePos.y); // Move the path to current mouse position
    }

    // Attach mouse event listeners to the canvas
    canvas.addEventListener('mousedown', startPosition);  // Mouse down to start drawing
    canvas.addEventListener('mouseup', endPosition);      // Mouse up to stop drawing
    canvas.addEventListener('mousemove', draw);           // Mouse move to draw on the canvas
    canvas.addEventListener('mouseout', endPosition);     // Mouse out to stop drawing if it leaves the canvas
}

// Wait for the page to load before running the content script
window.addEventListener('load', () => {
    console.log("Page loaded. Running content script...");
    addPaintCanvas();
});
