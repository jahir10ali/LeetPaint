const { applyBrushStroke } = require('../../src/js/brush');

describe('Brush Tool Functionality', () => {
  it('should apply the brush stroke with the correct color', () => {
    const context = {
      fillStyle: '',
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    };
    const color = '#000000';
    const size = 5;

    applyBrushStroke(context, 10, 10, 20, 20, color, size);

    expect(context.fillStyle).toBe(color);
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.moveTo).toHaveBeenCalledWith(10, 10);
    expect(context.lineTo).toHaveBeenCalledWith(20, 20);
    expect(context.stroke).toHaveBeenCalled();
  });
});
