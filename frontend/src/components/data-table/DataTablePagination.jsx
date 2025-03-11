"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDataTable } from "./DataTableContext";

export default function DataTablePagination() {
  const { pagination, goToPage, filteredData, paginatedData, data } =
    useDataTable();

  const { currentPage, pageSize, totalItems } = pagination;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const startRecord =
    filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;

  const endRecord = Math.min(startRecord + pageSize - 1, filteredData.length);

  return (
    <div className="p-2 bg-gray-100 flex items-center justify-between text-sm">
      <span>
        Records {startRecord} - {endRecord} of {filteredData.length}
        {filteredData.length !== data.length &&
          ` (filtered from ${data.length})`}
      </span>

      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <button
            className={`p-1 rounded ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`p-1 rounded ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
            onClick={() =>
              currentPage < totalPages && goToPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
