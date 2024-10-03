const { undo, redo } = require('../../src/js/undoRedo');

describe('Undo/Redo Functionality', () => {
  it('should correctly undo the last action', () => {
    const actions = ['draw1', 'draw2'];
    const canvasHistory = { actions, undoStack: [] };

    undo(canvasHistory);
    expect(canvasHistory.actions.length).toBe(1); 
    expect(canvasHistory.undoStack.length).toBe(1); 
  });

  it('should correctly redo the last undone action', () => {
    const canvasHistory = { actions: ['draw1'], undoStack: ['draw2'] };

    redo(canvasHistory);
    expect(canvasHistory.actions.length).toBe(2); 
    expect(canvasHistory.undoStack.length).toBe(0); 
  });
});
