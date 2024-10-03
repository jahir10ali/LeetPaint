/*const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../../content.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '../../js/content.js'), 'utf8');

describe('Eraser Tool Functionality', () => {
  let window, document, canvas, ctx, eraserBtn, colorPicker, currentColor, canvasBackgroundColor;

  beforeEach(() => {
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;

    canvas = document.getElementById('leetpaint-canvas');
    ctx = canvas.getContext('2d');

    eraserBtn = document.getElementById('type-select');
    colorPicker = document.getElementById('color-picker');
    
    const scriptTag = document.createElement('script');
    scriptTag.textContent = script;
    document.body.appendChild(scriptTag);

    currentColor = '#FFFFFF'; // Set eraser color (white)
    canvasBackgroundColor = '#1e1e1e'; // Background color of the canvas
    colorPicker.value = currentColor; // Set the color picker to white
    eraserBtn.value = 'eraser'; // Set to eraser
  });

  it('should erase the area with the correct size and background color', () => {
    // Simulate mouse down event
    const mouseEvent = new window.MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100
    });

    canvas.dispatchEvent(mouseEvent);
    
    // Simulate mouse move event to erase
    const mouseMoveEvent = new window.MouseEvent('mousemove', {
      clientX: 150,
      clientY: 150
    });
    canvas.dispatchEvent(mouseMoveEvent);
    
    // Simulate mouse up event
    const mouseUpEvent = new window.MouseEvent('mouseup');
    canvas.dispatchEvent(mouseUpEvent);

    // Check if the stroke is drawn with the eraser color (background color)
    expect(ctx.strokeStyle).toBe(canvasBackgroundColor);
  });
});
*/