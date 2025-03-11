"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// Create context
const DataTableContext = createContext(null);

// Custom hook to use the context
export function useDataTable() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context;
}

export function DataTableProvider({
  children,
  initialData = [],
  onAdd,
  onEdit,
  onDelete,
  idField = "id",
  searchFields = [],
}) {
  // State management
  const [data, setData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: initialData.length,
  });

  // Filter data based on search term
  const filteredData =
    searchTerm && searchFields.length > 0
      ? data.filter((item) =>
          searchFields.some((field) =>
            item[field]
              ?.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
        )
      : data;

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  // Selection handlers
  const toggleSelectAll = useCallback(() => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((item) => item[idField]));
    }
  }, [paginatedData, selectedRows.length, idField]);

  const toggleSelectRow = useCallback((id, e) => {
    if (e) e.stopPropagation();

    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // CRUD operations with API integration
  const addItem = useCallback(
    async (itemData) => {
      if (!onAdd) return;

      setIsLoading(true);
      setError(null);
      try {
        const result = await onAdd(itemData);

        // Check if the API call was successful
        if (!result.success && result.message) {
          throw new Error(result.message);
        }

        const newItem = result.data;
        if (!newItem) {
          throw new Error("API returned success but no data");
        }

        setData((prev) => [...prev, newItem]);
        return newItem;
      } catch (err) {
        setError(err.message || "Failed to add item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onAdd]
  );

  const editItem = useCallback(
    async (itemData) => {
      if (!onEdit) return;

      setIsLoading(true);
      setError(null);
      try {
        const result = await onEdit(itemData[idField], itemData);

        // Check if the API call was successful
        if (!result.success && result.message) {
          throw new Error(result.message);
        }

        const updatedItem = result.data;
        if (!updatedItem) {
          throw new Error("API returned success but no data");
        }

        setData((prev) =>
          prev.map((item) =>
            item[idField] === updatedItem[idField] ? updatedItem : item
          )
        );
        return updatedItem;
      } catch (err) {
        setError(err.message || "Failed to update item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onEdit, idField]
  );

  const deleteItems = useCallback(
    async (ids = selectedRows) => {
      if (!onDelete || ids.length === 0) return;

      setIsLoading(true);
      setError(null);
      try {
        // Delete items one by one and check for success
        const results = await Promise.all(
          ids.map(async (id) => {
            const result = await onDelete(id);
            // Check if deletion was successful
            if (!result.success && result.message) {
              throw new Error(`Failed to delete item ${id}: ${result.message}`);
            }
            return id;
          })
        );

        // Update local state by filtering out deleted items
        setData((prev) => prev.filter((item) => !ids.includes(item[idField])));
        setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
        return true;
      } catch (err) {
        setError(err.message || "Failed to delete items");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onDelete, selectedRows, idField]
  );

  // Pagination handlers
  const goToPage = useCallback((page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const setPageSize = useCallback((size) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      currentPage: 1, // Reset to first page when changing page size
    }));
  }, []);

  // Context value
  const value = {
    // Data
    data,
    setData,
    filteredData,
    paginatedData,

    // Selection
    selectedRows,
    setSelectedRows,
    toggleSelectAll,
    toggleSelectRow,

    // Search
    searchTerm,
    setSearchTerm,
    searchFields,

    // Current item (for edit/view)
    currentItem,
    setCurrentItem,

    // Loading and error states
    isLoading,
    setIsLoading,
    error,
    setError,

    // CRUD operations
    addItem,
    editItem,
    deleteItems,

    // Pagination
    pagination,
    goToPage,
    setPageSize,

    // Config
    idField,
  };

  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  );
}
