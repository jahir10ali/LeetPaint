// Function to inject CSS for the canvas and controls dynamically
function injectCanvasCSS() {
    const style = document.createElement('style');
    style.textContent = `
    /* Scoped styles for the paint tool */
    #paint-controls {
    margin-bottom: 20px;                     /* Increased spacing at the bottom */
    display: flex;                           /* Flexbox for horizontal alignment */
    align-items: center;                     /* Center items vertically */
    background-color: #2c2c2c;               /* Darker background for controls */
    padding: 15px;                           /* Padding for spacing */
    border-radius: 8px;                      /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Light shadow for depth */
    z-index: 1000;                           /* Ensure controls are on top */
    }

    #paint-controls label {
    margin-right: 15px;                      /* Increased spacing between label and input */
    color: #ffffff;                          /* White labels for contrast */
    font-size: 14px;                         /* Font size for better readability */
    font-weight: bold;                       /* Bold labels for emphasis */
    }

    #color-picker, #brush-size {
    border: 1px solid #555;                  /* Dark border around inputs */
    border-radius: 4px;                      /* Rounded corners */
    padding: 5px;                           /* Padding for better touch targets */
    background-color: #444;                  /* Dark background for inputs */
    color: #fff;                             /* White text color for inputs */
    margin-left: 10px;                       /* Spacing on the left side */
    }

    #color-picker {
    width: 60px;                             /* Fixed width for color picker */
    }

    #paint-controls button {
    background-color: #5a5a5a;               /* Neutral gray for buttons */
    color: white;                            /* White text color */
    border: none;                            /* No border */
    border-radius: 4px;                     /* Rounded corners */
    padding: 10px 15px;                     /* Padding for buttons */
    cursor: pointer;                         /* Pointer cursor for buttons */
    margin-left: 10px;                      /* Spacing between buttons */
    transition: background-color 0.3s, transform 0.2s; /* Smooth transitions */
    font-size: 14px;                        /* Font size for buttons */
    }

    #paint-controls button:hover {
    background-color: #777;                  /* Darker gray on hover */
    transform: translateY(-2px);            /* Slight lift on hover */
    }

    #paint-controls button:active {
    transform: translateY(0);                /* Reset position on active */
    }

    #leetpaint-canvas {
    cursor: crosshair;                      /* Change cursor to crosshair for precision */
    border: 2px solid #FFA116;              /* LeetCode's orange-yellow border */
    background-color: #1e1e1e;               /* Dark background for the canvas */
    margin-top: 20px;
    border-radius: 8px;                     /* Rounded corners for a modern look */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Enhanced shadow for depth */
    }
    `;
    document.head.appendChild(style);
}

// Function to add the paint canvas and controls to the LeetCode page
function addPaintCanvas() {
    console.log("Attempting to add paint canvas...");

    // Create a div for controls
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'paint-controls';

    // Color picker
    controlsDiv.innerHTML += `
    <label for="color-picker">Color:</label>
    <input type="color" id="color-picker" value="#0BDA51">
    `;

    // Brush size selector
    controlsDiv.innerHTML += `
    <label for="brush-size">Brush Size:</label>
    <input type="range" id="brush-size" min="1" max="20" value="8">
    `;

    // Undo and Redo buttons
    controlsDiv.innerHTML += `
    <button id="undo-btn">Undo</button>
    <button id="redo-btn">Redo</button>
    `;

    // Clear canvas button
    controlsDiv.innerHTML += `
    <button id="clear-btn">Clear</button>
    `;

    // Create the canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'leetpaint-canvas';
    canvas.width = window.innerWidth - 50; // Adjust canvas size
    canvas.height = 800; // Canvas height

    // Append the controls and canvas to the page
    const mainContent = document.querySelector('.description__24sA');
    if (mainContent) {
        mainContent.appendChild(controlsDiv);
        mainContent.appendChild(canvas);
        console.log("Canvas and controls added to main content");
    } else {
        document.body.appendChild(controlsDiv);
        document.body.appendChild(canvas);
        console.log("Canvas and controls added to body as fallback");
    }

    // Inject the CSS for the canvas
    injectCanvasCSS();

    // Initialize the canvas for painting
    initializePaintCanvas(canvas);
}

// Initialize the paint canvas with extended features
function initializePaintCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let painting = false;
    let strokeHistory = [];  // To store all the strokes for undo/redo
    let undoneHistory = [];  // To store undone strokes for redo functionality
    let images = [];         // Array to store images drawn on the canvas

    let currentColor = '#0BDA51';  // Default color
    let currentBrushSize = 8;      // Default brush size

    // Get the color and brush size controls
    const colorPicker = document.getElementById('color-picker');
    const brushSizePicker = document.getElementById('brush-size');

    // Undo/Redo buttons
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    // Clear button
    const clearBtn = document.getElementById('clear-btn');

    // Adjust for canvas offset
    const getMousePos = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    // Start drawing
    function startPosition(e) {
        painting = true;
        undoneHistory = []; // Clear redo history when drawing a new stroke
        strokeHistory.push([]); // Start a new stroke
        draw(e);
    }

    // Stop drawing
    function endPosition() {
        painting = false;
        ctx.beginPath();
    }

    // Draw on canvas
    function draw(e) {
        if (!painting) return;

        const mousePos = getMousePos(canvas, e);

        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;

        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);

        // Record the stroke
        strokeHistory[strokeHistory.length - 1].push({
            x: mousePos.x,
            y: mousePos.y,
            color: currentColor,
            size: currentBrushSize
        });
    }

    // Redraw all strokes from history and images
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Draw images first
        images.forEach(image => {
            ctx.drawImage(image.img, image.x, image.y);
        });

        // Draw strokes
        strokeHistory.forEach(stroke => {
            if (stroke.length === 0) return;
            ctx.beginPath();
            ctx.strokeStyle = stroke[0].color;
            ctx.lineWidth = stroke[0].size;
            ctx.moveTo(stroke[0].x, stroke[0].y);

            stroke.forEach(point => {
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
            });
        });
    }

    // Undo function
    function undo() {
        if (strokeHistory.length > 0) {
            undoneHistory.push(strokeHistory.pop());
            redraw();
        }
    }

    // Redo function
    function redo() {
        if (undoneHistory.length > 0) {
            strokeHistory.push(undoneHistory.pop());
            redraw();
        }
    }

    // Clear canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokeHistory = [];
        undoneHistory = [];
        images = []; // Clear images as well
    }

    // Update color on color picker change
    colorPicker.addEventListener('change', (e) => {
        currentColor = e.target.value;
    });

    // Update brush size on brush size picker change
    brushSizePicker.addEventListener('change', (e) => {
        currentBrushSize = e.target.value;
    });

    // Undo button listener
    undoBtn.addEventListener('click', undo);

    // Redo button listener
    redoBtn.addEventListener('click', redo);

    // Clear button listener
    clearBtn.addEventListener('click', clearCanvas);

    // Handle image drop
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default to allow drop
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const img = new Image();
                img.onload = function() {
                    // Store image with its original size and position
                    const x = (canvas.width - img.width) / 2; // Center the image
                    const y = (canvas.height - img.height) / 2; // Center the image
                    images.push({ img, x, y });
                    redraw(); // Redraw canvas with the new image
                };
                img.src = URL.createObjectURL(file); // Load the image
            }
        }
    });

    // Attach mouse event listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition);
}

// Wait for the page to load before running the content script
window.addEventListener('load', () => {
    console.log("Page loaded. Running content script...");
    addPaintCanvas();
});
