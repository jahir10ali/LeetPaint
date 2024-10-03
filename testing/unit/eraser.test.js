const { applyEraser } = require('../../src/js/eraser');

describe('Eraser Tool Functionality', () => {
  it('should erase the area with the correct size and background color', () => {
    const context = {
      fillStyle: '',
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    };
    const bgColor = '#ffffff'; 
    const brushSize = 8; 
    
    applyEraser(context, 30, 30, 50, 50, bgColor, brushSize);

    expect(context.fillStyle).toBe(bgColor);
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalledWith(30, 30);
    expect(context.lineTo).toHaveBeenCalledWith(50, 50);
    expect(context.stroke).toHaveBeenCalled();
  });
});
