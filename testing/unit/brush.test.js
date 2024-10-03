const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../../content.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '../../js/content.js'), 'utf8');

describe('Brush Tool Functionality', () => {
    let window, document, canvas, ctx, colorPicker, brushSizePicker, toggleButton;

    beforeEach(() => {
        const dom = new JSDOM(html, { runScripts: 'dangerously' });
        window = dom.window;
        document = window.document;

        // Create and append the canvas
        canvas = document.getElementById('leetpaint-canvas');
        canvas.style.display = 'none'; // Initially hidden

        // Create a toggle button to open the canvas
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-leetpaint-btn';
        toggleButton.innerText = 'Open LeetPaint';
        document.body.appendChild(toggleButton);

        ctx = canvas.getContext('2d');

        // Create and append color and brush size inputs
        colorPicker = document.getElementById('color-picker');
        brushSizePicker = document.getElementById('brush-size');

        // Append the script
        const scriptTag = document.createElement('script');
        scriptTag.textContent = script;
        document.body.appendChild(scriptTag);

        // Simulate clicking the toggle button to open the canvas
        toggleButton.click();
    });

    it('should apply the brush stroke with the correct color and size', () => {
        // Set initial values
        colorPicker.value = '#FF0000'; // Red color
        brushSizePicker.value = 10; // Brush size of 10

        // Simulate mouse down event
        const mouseDownEvent = new window.MouseEvent('mousedown', {
            clientX: 100,
            clientY: 100,
            buttons: 1 // Left mouse button
        });
        canvas.dispatchEvent(mouseDownEvent);

        // Simulate mouse move event to draw
        const mouseMoveEvent = new window.MouseEvent('mousemove', {
            clientX: 150,
            clientY: 150,
            buttons: 1 // Left mouse button
        });
        canvas.dispatchEvent(mouseMoveEvent);

        // Simulate mouse up event
        const mouseUpEvent = new window.MouseEvent('mouseup');
        canvas.dispatchEvent(mouseUpEvent);

        // Check if the stroke color was applied
        expect(ctx.strokeStyle).toBe(colorPicker.value); // Verify stroke color
        expect(ctx.lineWidth).toBe(parseInt(brushSizePicker.value)); // Verify stroke size
    });

    it('should update stroke history after drawing', () => {
        window.strokeHistory = []; // Mock stroke history array

        // Simulate mouse events for drawing
        const mouseDownEvent = new window.MouseEvent('mousedown', {
            clientX: 200,
            clientY: 200,
            buttons: 1 // Left mouse button
        });
        const mouseMoveEvent = new window.MouseEvent('mousemove', {
            clientX: 250,
            clientY: 250,
            buttons: 1 // Left mouse button
        });
        const mouseUpEvent = new window.MouseEvent('mouseup');

        // Dispatch events to simulate drawing
        canvas.dispatchEvent(mouseDownEvent);
        canvas.dispatchEvent(mouseMoveEvent);
        canvas.dispatchEvent(mouseUpEvent);

        // Check if stroke history is updated correctly
        expect(window.strokeHistory.length).toBe(1); // Ensure one stroke is recorded
        expect(window.strokeHistory[0]).toEqual(expect.objectContaining({
            x: expect.any(Number), // X coordinate of the stroke
            y: expect.any(Number), // Y coordinate of the stroke
            color: '#0BDA51', // Default color (if not changed)
            size: expect.any(Number) // Current size
        })); // Ensure it contains the correct data
    });
});
