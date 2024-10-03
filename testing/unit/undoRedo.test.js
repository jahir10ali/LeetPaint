/*const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../../content.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '../../js/content.js'), 'utf8');

describe('Undo/Redo Functionality', () => {
  let window, document, canvas, ctx, undoBtn, redoBtn, strokeHistory, undoneHistory;

  beforeEach(() => {
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;

    canvas = document.getElementById('leetpaint-canvas');
    ctx = canvas.getContext('2d');

    undoBtn = document.getElementById('undo-btn');
    redoBtn = document.getElementById('redo-btn');
    
    const scriptTag = document.createElement('script');
    scriptTag.textContent = script;
    document.body.appendChild(scriptTag);

    strokeHistory = []; // Reset stroke history
    undoneHistory = []; // Reset undone history
  });

  it('should correctly undo the last action', () => {
    // Simulate drawing action
    strokeHistory.push([{ x: 10, y: 10, color: '#0BDA51', size: 6 }]);

    // Perform undo
    const clickEvent = new window.MouseEvent('click');
    undoBtn.dispatchEvent(clickEvent);

    // Verify stroke history is now empty
    expect(strokeHistory.length).toBe(0);  
    expect(undoneHistory.length).toBe(1); // Check if the undone history has the last stroke
  });

  it('should correctly redo the last undone action', () => {
    // Simulate a stroke being drawn
    strokeHistory.push([{ x: 10, y: 10, color: '#0BDA51', size: 6 }]);
    strokeHistory.push([{ x: 20, y: 20, color: '#0BDA51', size: 6 }]);
    
    // Perform undo
    undoBtn.dispatchEvent(new window.MouseEvent('click'));

    // Perform redo
    redoBtn.dispatchEvent(new window.MouseEvent('click'));

    // Verify that the stroke history has the redone stroke
    expect(strokeHistory.length).toBe(2); 
    expect(undoneHistory.length).toBe(0); // Check if the undone history is empty
  });
});
*/