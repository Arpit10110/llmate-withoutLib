import React, { useState } from 'react';

const App = () => {
  const [columns, setColumns] = useState(['id']);
  const [rows, setRows] = useState([{ id: 1 }]);
  const [fieldname, setFieldname] = useState("");
  const [showNewFieldDiv, setShowNewFieldDiv] = useState(false);
  const [currentEditingCell, setCurrentEditingCell] = useState(null);
  const [addValue, setAddValue] = useState("");

  const addRow = () => {
    const newRow = {};
    columns.forEach(col => {
      if (col === 'id') {
        newRow[col] = rows.length + 1;
      } else {
        newRow[col] = []; 
      }
    });
    setRows([...rows, newRow]);
  };

  const addColumn = (e) => {
    e.preventDefault();
    const newColumn = fieldname.trim();
      setColumns([...columns, newColumn]);
      setRows(rows.map(row => ({ ...row, [newColumn]: [] }))); 
      setShowNewFieldDiv(false);
      setFieldname("");
  };

  const handleCellClick = (rowIndex, col) => {
    setCurrentEditingCell({ rowIndex, col });
  };

  const handleAddValue = (e) => {
    e.preventDefault();
    const { rowIndex, col } = currentEditingCell;
    const newArray = [...rows[rowIndex][col], addValue.trim()];
    setRows(rows.map((row, index) => (
      index === rowIndex ? { ...row, [col]: newArray } : row
    )));
    setAddValue("");
    setCurrentEditingCell(null);
  };

  const handleRemoveValue = (rowIndex, col, valueToRemove) => {
    const updatedArray = rows[rowIndex][col].filter(value => value !== valueToRemove);
    setRows(rows.map((row, index) => (
      index === rowIndex ? { ...row, [col]: updatedArray } : row
    )));
  };

  const formatCellValue = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      return value.map((val, index) => (
        <div key={index} className="flex items-center gap-2">
          <h6>
            {' • '} {val}
          </h6>
        </div>
      ));
    }
    return value;
  };

  const renderEditValues = (rowIndex, col) => {
    const values = rows[rowIndex][col];
    return values.length > 0 ? (
      values.map((val, index) => (
        <div key={index} className="flex items-center gap-2">
          <h6>
            {' • '} {val}
          </h6>
          <button 
            onClick={() => handleRemoveValue(rowIndex, col, val)} 
            className="text-red-500"
          >
            ×
          </button>
        </div>
      ))
    ) : <p>No values yet</p>;
  };

  return (
    <div className="p-4 relative">
      <button 
        onClick={() => setShowNewFieldDiv(true)} 
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add new column
      </button>

      {showNewFieldDiv && (
        <div className="NewFieldDiv absolute top-0 left-0 bg-[#1b1b1b85] h-[100vh] w-[100%] z-10 flex items-center justify-center">
          <form onSubmit={addColumn} className="box flex flex-col gap-4 items-center p-4 pt-16 h-[50vh] rounded-2xl bg-[#00000091] text-black w-[25%]">
            <input
              className="p-2 text-sm w-[100%] rounded-2xl font-medium"
              type="text"
              value={fieldname}
              onChange={(e) => setFieldname(e.target.value)}
              placeholder="Enter the Field name"
              required
            />
            <button type="submit" className="border-solid border-[2px] border-black p-2 rounded-2xl bg-blue-800 text-white">
              Create New Column
            </button>
            <button 
              type="button" 
              className="mt-2 text-red-500" 
              onClick={() => setShowNewFieldDiv(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {currentEditingCell && (
        <div className="Addvalue absolute top-0 left-0 bg-[#1b1b1b85] h-[100vh] w-[100%] z-10 flex items-center justify-center">
          <div className="box flex flex-col gap-4 items-center p-4 pt-16 h-[50vh] rounded-2xl bg-[#00000091] text-black w-[25%]">
            <form onSubmit={handleAddValue} className="flex flex-col gap-4">
              <input
                className="p-2 text-sm w-[100%] rounded-2xl font-medium"
                type="text"
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                placeholder="Enter new element"
                required
              />
              <button type="submit" className="border-solid border-[2px] border-black p-2 rounded-2xl bg-blue-800 text-white">
                Add Element
              </button>
              <button 
                type="button" 
                className="mt-2 text-red-500" 
                onClick={() => setCurrentEditingCell(null)}
              >
                Cancel
              </button>
              <div className="mt-4 text-center">
                <h4 className="font-semibold">Current Values:</h4>
                {renderEditValues(currentEditingCell.rowIndex, currentEditingCell.col)}
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table border border-gray-300">
        <div 
          className="grid bg-gray-200 p-2" 
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((col, index) => (
            <h3 
              key={index} 
              className="font-semibold text-center border-b border-gray-300 p-2">
              {col}
            </h3>
          ))}
        </div>
        <div className="rows">
          {rows.map((row, rowIndex) => (
            <div 
              className="grid" 
              key={rowIndex}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              {columns.map((col, colIndex) => (
                <div 
                  key={colIndex} 
                  onClick={() => handleCellClick(rowIndex, col)} 
                  className="p-4 border border-gray-300 text-center cursor-pointer hover:bg-gray-100"
                >
                  {formatCellValue(row[col]) || <span className="text-gray-400">Click to add value</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={addRow} 
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add new row
      </button>
    </div>
  );
};

export default App;
