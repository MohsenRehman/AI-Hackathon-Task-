import React from 'react';
import Spinner from '../ui/Spinner.jsx';
import EmptyState from './EmptyState.jsx';

const DataTable = ({ columns, data, isLoading, emptyMessage }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="md" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage || 'No records found'} />;
  }

  return (
    <div className="table-container bg-white">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={col.className}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
