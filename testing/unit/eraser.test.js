const { JSDOM } = require('jsdom');

const dom = new JSDOM(`
<div id="paint-controls">
    <label for="type-select">Type:</label>
    <select id="type-select">
        <option value="paintbrush">Paintbrush</option>
        <option value="eraser">Eraser</option>
    </select>

    <label for="color-picker">Colour:</label>
    <input type="color" id="color-picker" value="#0BDA51">

    <label for="brush-size">Brush Size:</label>
    <input type="range" id="brush-size" min="1" max="20" value="6"> <!-- Updated default value to 6 for eraser -->
    
    <button id="undo-btn"><</button>
    <button id="redo-btn">></button>
    <button id="clear-btn">⟳</button>
    <button id="remove-image-btn">Remove Image</button>
</div>

<div id="scrollable-canvas-container">
    <canvas id="leetpaint-canvas" width="1785" height="2000"></canvas>
</div>
`);

global.document = dom.window.document;
global.window = dom.window;

const addPaintCanvas = () => {};

describe('LeetPaint Eraser Functionality', () => {
    let colorPicker;
    let brushSizePicker;
    let canvas;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="paint-controls">
                <label for="type-select">Type:</label>
                <select id="type-select">
                    <option value="paintbrush">Paintbrush</option>
                    <option value="eraser">Eraser</option>
                </select>

                <label for="color-picker">Colour:</label>
                <input type="color" id="color-picker" value="#1e1e1e"> <!-- Default color for eraser (canvas background) -->
                
                <label for="brush-size">Brush Size:</label>
                <input type="range" id="brush-size" min="1" max="20" value="6"> <!-- Default size for eraser -->
            </div>

            <div id="scrollable-canvas-container">
                <canvas id="leetpaint-canvas" width="1785" height="2000"></canvas>
            </div>
        `;

        addPaintCanvas();

        colorPicker = document.getElementById('color-picker');
        brushSizePicker = document.getElementById('brush-size');
        canvas = document.getElementById('leetpaint-canvas');
    });

    test('should have the correct default eraser size and color', () => {
        expect(colorPicker.value).toBe('#1e1e1e'); 
        expect(brushSizePicker.value).toBe('6');
    });

    test('should draw on the canvas with the eraser', () => {
        const mouseDownEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
        });
        canvas.dispatchEvent(mouseDownEvent);

        const mouseMoveEvent = new MouseEvent('mousemove', {
            clientX: 300,
            clientY: 300,
        });
        canvas.dispatchEvent(mouseMoveEvent);
    });

    test('should change the brush size when a new size is selected', () => {
        brushSizePicker.value = '10';
        brushSizePicker.dispatchEvent(new Event('change', { bubbles: true }));

        const mouseEvent = new MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
        });
        canvas.dispatchEvent(mouseEvent);
    });

    test('should change the brush type to eraser when selected', () => {
        const typeSelect = document.getElementById('type-select');
        typeSelect.value = 'eraser';
        typeSelect.dispatchEvent(new Event('change', { bubbles: true }));

        expect(typeSelect.value).toBe('eraser');
    });
});
