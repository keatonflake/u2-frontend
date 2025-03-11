"use client";

import {
  Search,
  Printer,
  Download,
  FileText,
  Plus,
  Trash,
  Edit,
  Filter,
} from "lucide-react";
import { useDataTable } from "./DataTableContext";

export default function DataTableToolbar({
  onAdd,
  onEdit,
  onDelete,
  onExport,
  onPrint,
  onFilter,
  onViewDetails,
  toolbarActions,
  searchPlaceholder = "Search...",
}) {
  const {
    searchTerm,
    setSearchTerm,
    selectedRows,
    currentItem,
    setCurrentItem,
  } = useDataTable();

  // Default toolbar actions
  const defaultToolbarActions = [
    {
      id: "add",
      icon: <Plus size={20} />,
      tooltip: "Add New",
      onClick: onAdd,
      disabled: false,
      show: !!onAdd,
    },
    {
      id: "edit",
      icon: <Edit size={20} />,
      tooltip: "Edit",
      onClick: () =>
        selectedRows.length === 1 && onEdit && onEdit(selectedRows[0]),
      disabled: selectedRows.length !== 1,
      show: !!onEdit,
    },
    {
      id: "delete",
      icon: <Trash size={20} />,
      tooltip: "Delete",
      onClick: () =>
        selectedRows.length > 0 && onDelete && onDelete(selectedRows),
      disabled: selectedRows.length === 0,
      show: !!onDelete,
    },
    {
      id: "divider1",
      isDivider: true,
      show: !!(onViewDetails || onFilter || onPrint || onExport),
    },
    {
      id: "details",
      icon: <FileText size={20} />,
      tooltip: "View Details",
      onClick: () =>
        selectedRows.length === 1 &&
        onViewDetails &&
        onViewDetails(selectedRows[0]),
      disabled: selectedRows.length !== 1,
      show: !!onViewDetails,
    },
    {
      id: "filter",
      icon: <Filter size={20} />,
      tooltip: "Filter",
      onClick: onFilter,
      disabled: false,
      show: !!onFilter,
    },
    {
      id: "print",
      icon: <Printer size={20} />,
      tooltip: "Print",
      onClick: onPrint,
      disabled: false,
      show: !!onPrint,
    },
    {
      id: "export",
      icon: <Download size={20} />,
      tooltip: "Export",
      onClick: onExport,
      disabled: false,
      show: !!onExport,
    },
  ];

  // Combine default actions with any custom actions passed in
  const actions = toolbarActions || defaultToolbarActions;

  return (
    <div className="bg-white border-b p-2 flex items-center space-x-2">
      {actions
        .filter((action) => action.show !== false)
        .map((action, index) =>
          action.isDivider ? (
            <span
              key={`divider-${index}`}
              className="w-px h-6 bg-gray-300 mx-1"
            ></span>
          ) : (
            <button
              key={action.id}
              className={`p-2 rounded ${
                action.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={action.onClick}
              disabled={action.disabled}
              title={action.tooltip}
            >
              {action.icon}
            </button>
          )
        )}

      <div className="flex items-center ml-auto relative">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="border rounded-lg px-3 py-1 pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={16} className="absolute left-2 text-gray-500" />
      </div>
    </div>
  );
}
