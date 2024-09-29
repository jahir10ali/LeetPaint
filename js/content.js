// Function to inject CSS for the canvas and controls dynamically
function injectCanvasCSS() {
    const style = document.createElement('style');
    style.textContent = `
    #leetpaint-canvas {
    cursor: crosshair;              /* Change cursor to crosshair for precision */
    border: 2px solid #FFA116;       /* LeetCode's orange-yellow border */
    margin-top: 20px;
    }
    #paint-controls {
    margin-bottom: 10px;
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
    controlsDiv.style.marginBottom = '10px';

    // Color picker
    controlsDiv.innerHTML += `
    <label for="color-picker">Color:</label>
    <input type="color" id="color-picker" value="#0BDA51" style="margin-right: 10px;">
    `;

    // Brush size selector
    controlsDiv.innerHTML += `
    <label for="brush-size">Brush Size:</label>
    <input type="range" id="brush-size" min="1" max="20" value="5" style="margin-right: 10px;">
    `;

    // Undo and Redo buttons
    controlsDiv.innerHTML += `
    <button id="undo-btn">Undo</button>
    <button id="redo-btn" style="margin-right: 10px;">Redo</button>
    `;

    // Clear canvas button
    controlsDiv.innerHTML += `
    <button id="clear-btn">Clear</button>
    `;

    // Create the canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'leetpaint-canvas';
    canvas.width = window.innerWidth - 50; // Adjust canvas size
    canvas.height = 400; // Canvas height
    canvas.style.marginTop = '20px';

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

    let currentColor = '#0BDA51';  // Default color
    let currentBrushSize = 5;      // Default brush size

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

    // Redraw all strokes from history
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

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
