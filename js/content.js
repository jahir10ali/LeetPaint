// Function to create and add the "Use LeetPaint" button
function createToggleButton() {
    const button = document.createElement('button');
    button.id = 'toggle-leetpaint-btn';
    button.innerText = 'Open LeetPaint';
    button.style.position = 'absolute'; // Change to absolute positioning

    button.addEventListener('click', () => {
        const canvasContainer = document.getElementById('leetpaint-canvas');
        const controlsContainer = document.getElementById('paint-controls');
        const scrollableContainer = document.getElementById('scrollable-canvas-container');

        if (scrollableContainer.style.display === 'none' || !scrollableContainer.style.display) {
            button.innerText = 'Close LeetPaint';
            scrollableContainer.style.display = 'block'; // Show the entire container
            canvasContainer.style.display = 'block'; // Show the canvas
            controlsContainer.style.display = 'flex'; // Show the controls
            canvasContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to the canvas
        } else {
            button.innerText = 'Open LeetPaint';
            scrollableContainer.style.display = 'none'; // Hide the entire container
            canvasContainer.style.display = 'none'; // Hide the canvas
            controlsContainer.style.display = 'none'; // Hide the controls
        }
    });

    document.body.appendChild(button); // Append the button to the body

    // Update button position based on scroll
    const updateButtonPosition = () => {
        const mainContent = document.querySelector('.description__24sA'); // Main content area
        if (mainContent) {
            const rect = mainContent.getBoundingClientRect();
            button.style.top = `${window.scrollY + rect.bottom + 20}px`; // Position below the main content
        }
    };

    // Update button position on scroll
    window.addEventListener('scroll', updateButtonPosition);
}

// Function to add the paint canvas and controls to the LeetCode page
function addPaintCanvas() {
    console.log("Attempting to add paint canvas...");

    // Fetch content.html and insert it into the page
    fetch(chrome.runtime.getURL('content.html'))
    .then(response => response.text())
    .then(data => {
        // Create a temporary container for the fetched HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;

        // Append the controls and canvas to the page
        const mainContent = document.querySelector('.description__24sA');
        if (mainContent) {
            mainContent.appendChild(tempDiv);
            console.log("Canvas and controls added to main content");
        } else {
            document.body.appendChild(tempDiv);
            console.log("Canvas and controls added to body as fallback");
        }

        // Hide the canvas and controls initially
        const canvas = document.getElementById('leetpaint-canvas');
        const controls = document.getElementById('paint-controls');
        canvas.style.display = 'none'; // Initially hidden
        controls.style.display = 'none'; // Initially hidden

        // Create the toggle button
        createToggleButton();

        // Initialize the canvas for painting
        initializePaintCanvas(canvas);
    })
    .catch(error => {
        console.error("Error loading content.html:", error);
    });
}

// Initialize the paint canvas with extended features (same as before)
function initializePaintCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let painting = false;
    let strokeHistory = [];  // To store all the strokes for undo/redo
    let undoneHistory = [];  // To store undone strokes for redo functionality
    let images = [];         // Array to store images drawn on the canvas

    let currentColor = '#0BDA51';  // Default color
    let currentBrushSize = 6;      // Default brush size

    // Get the color and brush size controls
    const colorPicker = document.getElementById('color-picker');
    const brushSizePicker = document.getElementById('brush-size');

    // Undo/Redo buttons
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    // Clear button
    const clearBtn = document.getElementById('clear-btn');

    const removeImageBtn = document.getElementById('remove-image-btn');

    // Adjust for canvas offset and scroll
    const getMousePos = (canvas, event) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top + document.getElementById('scrollable-canvas-container').scrollTop
        };
    };

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
            ctx.beginPath(); // Start a new path for each stroke
            ctx.strokeStyle = stroke[0].color;
            ctx.lineWidth = stroke[0].size;
            ctx.moveTo(stroke[0].x, stroke[0].y);

            stroke.forEach(point => {
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            });
        });
        ctx.beginPath(); // Reset the path to avoid connecting the next drawing to the last stroke
    }

    // Start drawing
    function startPosition(e) {
        painting = true;
        undoneHistory = []; // Clear redo history when drawing a new stroke
        strokeHistory.push([]); // Start a new stroke
        ctx.beginPath(); // Reset the path when starting a new stroke to avoid drawing from the previous point
        draw(e);
    }

    // Stop drawing
    function endPosition() {
        painting = false;
        ctx.beginPath(); // Reset the path after completing a stroke to avoid connecting strokes
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
        ctx.beginPath(); // Start a new path so that the next `lineTo` doesn't connect from the previous point
        ctx.moveTo(mousePos.x, mousePos.y);

        // Record the stroke
        strokeHistory[strokeHistory.length - 1].push({
            x: mousePos.x,
            y: mousePos.y,
            color: currentColor,
            size: currentBrushSize
        });
    }

    // Undo function
    function undo() {
        if (strokeHistory.length > 0) {
            undoneHistory.push(strokeHistory.pop());
            redraw(); // Redraw the canvas after undoing a stroke
        }
        ctx.beginPath(); // Reset the path after undoing to avoid connecting new strokes to the previous ones
    }

    // Redo function
    function redo() {
        if (undoneHistory.length > 0) {
            strokeHistory.push(undoneHistory.pop());
            redraw(); // Redraw the canvas after redoing a stroke
        }
        ctx.beginPath(); // Reset the path after redoing to avoid connecting new strokes to the previous ones
    }


    // Clear canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
        strokeHistory = []; // Clear only the stroke history
        // Do not clear the images; keep them intact
        redraw(); // Redraw to show remaining images
    }

    function removeImage() {
        images = []; // Clear the images array
        redraw(); // Redraw the canvas to reflect the removal
        updateRemoveImageButtonVisibility(); // Update button visibility after removing the image
    }

    function updateRemoveImageButtonVisibility() {
        const removeImageBtn = document.getElementById('remove-image-btn');
        if (images.length > 0) {
            removeImageBtn.style.display = 'inline-block'; // Show the button
        } else {
            removeImageBtn.style.display = 'none'; // Hide the button
        }
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

    removeImageBtn.addEventListener('click', removeImage)

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
                    updateRemoveImageButtonVisibility(); // Update button visibility after adding an image

                };
                img.src = URL.createObjectURL(file); // Load the image
            }
        }
    });

    updateRemoveImageButtonVisibility();

    // Attach mouse event listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition);
}

// Function to force a full page reload and ensure correct URL
function forcePageReload(targetUrl) {
    if (targetUrl) {
        // Update the current URL before reloading
        window.history.replaceState(null, null, targetUrl);
    }
    window.location.reload(); // Force full page reload
}

// Wait for the page to load before running the content script
window.addEventListener('load', () => {
    console.log("Page loaded. Running content script...");

    // Add LeetPaint canvas
    addPaintCanvas();

    // Force page reload on link clicks
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a'); // Check if the clicked element is a link
        if (target) {
            event.preventDefault(); // Prevent default navigation behavior
            forcePageReload(target.href); // Force reload to the clicked link's URL
        }
    });

    // Listen for browser back/forward navigation (popstate) and handle the reload
    window.addEventListener('popstate', () => {
        const isOnProblemPage = window.location.href.includes('/problems/');

        if (!isOnProblemPage) {
            // If not on a problem page (likely on the problem list), reload the page
            forcePageReload(window.location.href);
        } else {
            // If on a problem page, reload the problem list instead
            const problemListUrl = '/list/problems'; // Replace with the actual problem list URL
            forcePageReload(problemListUrl);
        }
    });
});
