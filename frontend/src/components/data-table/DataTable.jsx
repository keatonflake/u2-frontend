"use client";

import { useDataTable } from "./DataTableContext";

export default function DataTable({
  columns,
  onRowClick,
  emptyMessage = "No data available",
  striped = true,
  hoverable = true,
  stickyHeader = true,
}) {
  const {
    paginatedData,
    selectedRows,
    toggleSelectAll,
    toggleSelectRow,
    idField,
    isLoading,
    error,
  } = useDataTable();

  // Render error message if there is one
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <h3 className="text-lg font-medium">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead
            className={`bg-gray-300 text-black text-sm ${
              stickyHeader ? "sticky top-0" : ""
            }`}
          >
            <tr>
              {columns.some((col) => col.id === "select") && (
                <th
                  className={`w-10 p-2 ${
                    stickyHeader ? "sticky top-0 bg-gray-300" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={
                      selectedRows.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}

              {columns
                .filter((col) => col.id !== "select")
                .map((column) => (
                  <th
                    key={column.id}
                    className={`p-2 text-left font-medium ${
                      stickyHeader ? "sticky top-0 bg-gray-300" : ""
                    } ${column.className || ""}`}
                    style={column.width ? { width: column.width } : {}}
                  >
                    {column.header}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-gray-200 text-sm ${
              !paginatedData.length ? "h-40" : ""
            }`}
          >
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const rowId = row[idField];
                const isSelected = selectedRows.includes(rowId);

                return (
                  <tr
                    key={rowId || rowIndex}
                    className={`
                      ${isSelected ? "bg-blue-100" : ""} 
                      ${hoverable ? "hover:bg-blue-50" : ""}
                      ${
                        striped && rowIndex % 2 === 1 && !isSelected
                          ? "bg-gray-50"
                          : ""
                      }
                    `}
                    onClick={() => (onRowClick ? onRowClick(row) : null)}
                    style={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    {columns.some((col) => col.id === "select") && (
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={isSelected}
                          onChange={(e) => {}} // Controlled component
                          onClick={(e) => toggleSelectRow(rowId, e)}
                        />
                      </td>
                    )}

                    {columns
                      .filter((col) => col.id !== "select")
                      .map((column) => (
                        <td
                          key={`${rowId}-${column.id}`}
                          className={`p-2 ${column.cellClassName || ""}`}
                        >
                          {column.cell
                            ? column.cell(row)
                            : row[column.accessor]}
                        </td>
                      ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-4 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
