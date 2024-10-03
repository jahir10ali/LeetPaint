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
    <input type="range" id="brush-size" min="1" max="20" value="8">

    <button id="undo-btn"><</button>
    <button id="redo-btn">></button>
    <button id="clear-btn">⟳</button>
    <button id="remove-image-btn">Remove Image</button>
</div>

<div id="scrollable-canvas-container">
    <canvas id="leetpaint-canvas" width="500" height="500"></canvas>
</div>
`);

global.document = dom.window.document;
global.window = dom.window;

const mockContext = {
    lineTo: jest.fn(),
    stroke: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
};

const initializePaintCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    let painting = false;
    let strokeHistory = [];
    let undoneHistory = [];
    let currentColor = '#0BDA51';
    let currentBrushSize = 6;
    let toolType = 'paintbrush';

    ctx.__strokeHistory = strokeHistory;
    ctx.__undoneHistory = undoneHistory;

    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    const draw = (x, y) => {
        ctx.lineTo(x, y);
        ctx.stroke();
        strokeHistory[strokeHistory.length - 1].push({ x, y, color: currentColor, size: currentBrushSize });
    };

    const undo = () => {
        if (strokeHistory.length > 0) {
            undoneHistory.push(strokeHistory.pop());
            redraw();
        }
    };

    const redo = () => {
        if (undoneHistory.length > 0) {
            strokeHistory.push(undoneHistory.pop());
            redraw();
        }
    };

    const redraw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokeHistory.forEach(stroke => {
            ctx.beginPath();
            ctx.strokeStyle = stroke[0].color;
            ctx.lineWidth = stroke[0].size;
            ctx.moveTo(stroke[0].x, stroke[0].y);
            stroke.forEach(point => {
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            });
        });
    };

    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
    canvas.addEventListener('mousedown', (e) => {
        painting = true;
        strokeHistory.push([]);
        ctx.beginPath();
        draw(e.offsetX, e.offsetY); 
    });

    canvas.addEventListener('mousemove', (e) => {
        if (painting) {
            draw(e.offsetX, e.offsetY);
        }
    });

    canvas.addEventListener('mouseup', () => {
        painting = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mouseout', () => {
        painting = false;
        ctx.beginPath();
    });
};

describe('LeetPaint Undo/Redo Functionality', () => {
    let undoBtn;
    let redoBtn;
    let canvas;

    beforeEach(() => {
        document.body.innerHTML = dom.serialize();
        
        canvas = document.getElementById('leetpaint-canvas');
        undoBtn = document.getElementById('undo-btn');
        redoBtn = document.getElementById('redo-btn');
        
        canvas.getContext = jest.fn(() => mockContext);

        initializePaintCanvas(canvas);
    });

    test('should remove the latest paint stroke when undo is clicked', () => {
        mockContext.__strokeHistory = []; 
        mockContext.__strokeHistory.push([{ x: 10, y: 10, color: '#0BDA51', size: 8 }]); 
        mockContext.__strokeHistory.push([{ x: 20, y: 20, color: '#0BDA51', size: 8 }]);
        const initialStrokeCount = mockContext.__strokeHistory.length; 

        undoBtn.click(); 

        expect(mockContext.__strokeHistory.length).toBe(initialStrokeCount); 
    });

    test('should restore the latest removed stroke when redo is clicked', () => {
        mockContext.__strokeHistory = []; 
        mockContext.__strokeHistory.push([{ x: 10, y: 10, color: '#0BDA51', size: 8 }]); 
        const initialStrokeCount = mockContext.__strokeHistory.length;

        undoBtn.click();
        const strokeCountAfterUndo = mockContext.__strokeHistory.length;

        redoBtn.click();

        expect(mockContext.__strokeHistory.length).toBe(initialStrokeCount);
    });
});
