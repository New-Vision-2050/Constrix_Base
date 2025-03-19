import { RowsState, RowsAction } from './types';

// Reducer function for managing rows state
export const rowsReducer = (state: RowsState, action: RowsAction): RowsState => {
  switch (action.type) {
    case 'SET_ROWS':
      return {
        ...state,
        rows: action.rows,
      };
    case 'ADD_ROW':
      return {
        ...state,
        rows: [
          ...state.rows,
          { ...action.defaultValues, _id: `row-${Date.now()}` }
        ],
      };
    case 'DELETE_ROW':
      const newRows = state.rows.filter((_, index) => index !== action.rowIndex);
      const newPendingChanges = { ...state.pendingChanges };
      delete newPendingChanges[action.rowIndex];
      
      // Adjust indices for rows after the deleted row
      Object.keys(newPendingChanges).forEach((indexStr) => {
        const index = parseInt(indexStr);
        if (index > action.rowIndex) {
          newPendingChanges[index - 1] = newPendingChanges[index];
          delete newPendingChanges[index];
        }
      });
      
      return {
        ...state,
        rows: newRows,
        pendingChanges: newPendingChanges,
      };
    case 'UPDATE_ROW':
      const updatedRows = state.rows.map((row, index) => {
        if (index === action.rowIndex) {
          return {
            ...row,
            [action.fieldName]: action.value
          };
        }
        return row;
      });
      
      const updatedPendingChanges = {
        ...state.pendingChanges,
        [action.rowIndex]: {
          ...(state.pendingChanges[action.rowIndex] || {}),
          [action.fieldName]: action.value
        }
      };
      
      return {
        ...state,
        rows: updatedRows,
        pendingChanges: updatedPendingChanges,
      };
    case 'MOVE_ROW':
      const movedRows = [...state.rows];
      const [movedRow] = movedRows.splice(action.oldIndex, 1);
      movedRows.splice(action.newIndex, 0, movedRow);
      
      // Adjust pending changes to match the new order
      const movedPendingChanges: Record<number, Record<string, any>> = {};
      
      // Copy changes with adjusted indices
      Object.keys(state.pendingChanges).forEach((indexStr) => {
        const index = parseInt(indexStr);
        let newIndex = index;
        
        if (index === action.oldIndex) {
          newIndex = action.newIndex;
        } else if (index > action.oldIndex && index <= action.newIndex) {
          newIndex = index - 1;
        } else if (index < action.oldIndex && index >= action.newIndex) {
          newIndex = index + 1;
        }
        
        movedPendingChanges[newIndex] = state.pendingChanges[index];
      });
      
      return {
        ...state,
        rows: movedRows,
        pendingChanges: movedPendingChanges,
      };
    case 'SET_ROW_ERRORS':
      return {
        ...state,
        rowErrors: action.rowErrors,
      };
    case 'CLEAR_PENDING_CHANGES':
      return {
        ...state,
        pendingChanges: {},
      };
    case 'RESET':
      return {
        rows: action.defaultRows,
        pendingChanges: {},
        rowErrors: {},
      };
    default:
      return state;
  }
};