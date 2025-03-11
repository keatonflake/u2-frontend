"use client";

import { useState } from "react";
import {
  DataTableProvider,
  DataTable,
  DataTableToolbar,
  DataTablePagination,
} from "@/components/data-table";
import Modal from "@/components/ui/Modal";
import CompanyForm from "./CompanyForm";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import {
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/lib/CompanyManagement";

export default function CompaniesTable({ initialCompanies = [] }) {
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // API handlers
  const handleAddCompany = async (companyData) => {
    try {
      const result = await createCompany(companyData);
      if (!result.success) {
        throw new Error(result.message || "Failed to add company");
      }
      return result;
    } catch (error) {
      console.error("Failed to add company:", error);
      throw error;
    }
  };

  const handleEditCompany = async (companyData) => {
    try {
      const result = await updateCompany(companyData.company_code, companyData);
      if (!result.success) {
        throw new Error(result.message || "Failed to update company");
      }
      return result;
    } catch (error) {
      console.error("Failed to update company:", error);
      throw error;
    }
  };

  const handleDeleteCompanies = async (ids) => {
    try {
      // Delete companies one by one
      for (const id of ids) {
        const result = await deleteCompany(id);
        if (!result.success) {
          throw new Error(result.message || `Failed to delete company ${id}`);
        }
      }
      return true;
    } catch (error) {
      console.error("Failed to delete companies:", error);
      throw error;
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const openEditModal = (companyId) => {
    const company = initialCompanies.find((c) => c.company_code === companyId);
    if (company) {
      setCurrentCompany(company);
      setIsEditModalOpen(true);
    }
  };

  const openDeleteConfirm = (ids) => {
    setSelectedRows(ids);
    setIsDeleteConfirmOpen(true);
  };

  const handleAddSubmit = async (data) => {
    try {
      await handleAddCompany(data);
      setIsAddModalOpen(false);
      // Refresh data would happen via the DataTableContext in a real app
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await handleEditCompany(data);
      setIsEditModalOpen(false);
      setCurrentCompany(null);
      // Refresh data would happen via the DataTableContext in a real app
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await handleDeleteCompanies(selectedRows);
      setIsDeleteConfirmOpen(false);
      setSelectedRows([]);
      // Refresh data would happen via the DataTableContext in a real app
    } catch (error) {
      console.error("Error deleting companies:", error);
    }
  };

  // Define columns for the table - updated with all fields from the database
  const columns = [
    { id: "select", header: "", accessor: "" },
    { id: "subscriber_id", header: "Subscriber ID", accessor: "subscriber_id" },
    { id: "company_code", header: "Co Code", accessor: "company_code" },
    { id: "company_name", header: "Company Name", accessor: "company_name" },
    { id: "company_type", header: "Type", accessor: "company_type" },
    { id: "currency_mode", header: "Curr Mode", accessor: "currency_mode" },
    { id: "currency_time", header: "Curr Time", accessor: "currency_time" },
    { id: "country_type", header: "Country Type", accessor: "country_type" },
    { id: "country_code", header: "Country Code", accessor: "country_code" },
    { id: "category_code1", header: "Cat Code 1", accessor: "category_code1" },
    { id: "category_code2", header: "Cat Code 2", accessor: "category_code2" },
    {
      id: "current_fiscal_year",
      header: "Fiscal Year",
      accessor: "current_fiscal_year",
    },
    {
      id: "current_period",
      header: "Current Period",
      accessor: "current_period",
    },
    {
      id: "fiscal_start_period",
      header: "Fiscal Start",
      accessor: "fiscal_start_period",
    },
    {
      id: "fiscal_end_period",
      header: "Fiscal End",
      accessor: "fiscal_end_period",
    },
    {
      id: "no_printing",
      header: "No Printing",
      accessor: "no_printing",
    },
    {
      id: "special_handling",
      header: "Special Handling",
      accessor: "special_handling",
    },
    {
      id: "no_52_period",
      header: "No 52 Period",
      accessor: "no_52_period",
    },
    {
      id: "capital_reports",
      header: "Capital Reports",
      accessor: "capital_reports",
    },
    {
      id: "maturity_calc_type",
      header: "Maturity Calc",
      accessor: "maturity_calc_type",
    },
    {
      id: "detail_level",
      header: "Detail Level",
      accessor: "detail_level",
    },
    {
      id: "unit_number",
      header: "Unit Number",
      accessor: "unit_number",
    },
    {
      id: "year_code",
      header: "Year Code",
      accessor: "year_code",
    },
    {
      id: "fiscal_setting",
      header: "Fiscal Setting",
      accessor: "fiscal_setting",
    },
    {
      id: "currency_code",
      header: "Currency Code",
      accessor: "currency_code",
    },
    {
      id: "date_format",
      header: "Date Format",
      accessor: "date_format",
    },
    {
      id: "company_country",
      header: "Country",
      accessor: "company_country",
    },
    {
      id: "fiscal_period_pattern",
      header: "Fiscal Pattern",
      accessor: "fiscal_period_pattern",
    },
    {
      id: "calendar_type",
      header: "Calendar Type",
      accessor: "calendar_type",
    },
    {
      id: "company_prefix",
      header: "Company Prefix",
      accessor: "company_prefix",
    },
    {
      id: "created_by",
      header: "Created By",
      accessor: "created_by",
    },
    {
      id: "created_program",
      header: "Created Program",
      accessor: "created_program",
    },
    {
      id: "created_date",
      header: "Created Date",
      accessor: "created_date",
      cell: (row) =>
        row.created_date ? new Date(row.created_date).toLocaleDateString() : "",
    },
    {
      id: "updated_by",
      header: "Updated By",
      accessor: "updated_by",
    },
    {
      id: "updated_program",
      header: "Updated Program",
      accessor: "updated_program",
    },
    {
      id: "updated_date",
      header: "Updated Date",
      accessor: "updated_date",
      cell: (row) =>
        row.updated_date ? new Date(row.updated_date).toLocaleDateString() : "",
    },
    {
      id: "updated_time",
      header: "Updated Time",
      accessor: "updated_time",
    },
    {
      id: "job_name",
      header: "Job Name",
      accessor: "job_name",
    },
    {
      id: "system_created_by",
      header: "System Created By",
      accessor: "system_created_by",
    },
    {
      id: "system_creation_date",
      header: "System Creation Date",
      accessor: "system_creation_date",
      cell: (row) =>
        row.system_creation_date
          ? new Date(row.system_creation_date).toLocaleString()
          : "",
    },
    {
      id: "system_updated_by",
      header: "System Updated By",
      accessor: "system_updated_by",
    },
    {
      id: "system_update_date",
      header: "System Update Date",
      accessor: "system_update_date",
      cell: (row) =>
        row.system_update_date
          ? new Date(row.system_update_date).toLocaleString()
          : "",
    },
    {
      id: "is_deleted",
      header: "Deleted",
      accessor: "is_deleted",
      cell: (row) => (row.is_deleted ? "Yes" : "No"),
    },
    {
      id: "deleted_date",
      header: "Deleted Date",
      accessor: "deleted_date",
      cell: (row) =>
        row.deleted_date ? new Date(row.deleted_date).toLocaleString() : "",
    },
    {
      id: "deleted_by",
      header: "Deleted By",
      accessor: "deleted_by",
    },
  ];

  return (
    <div className="flex flex-col h-full border shadow-sm m-1">
      <DataTableProvider
        initialData={initialCompanies}
        onAdd={handleAddCompany}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompanies}
        idField="company_code"
        searchFields={["company_code", "company_name", "subscriber_id"]}
      >
        {/* Toolbar */}
        <DataTableToolbar
          onAdd={openAddModal}
          onEdit={(ids) => openEditModal(ids[0])}
          onDelete={openDeleteConfirm}
          onExport={() => console.log("Export functionality")}
          onPrint={() => console.log("Print functionality")}
          onFilter={() => console.log("Filter functionality")}
          onViewDetails={(id) => console.log("View details", id)}
          searchPlaceholder="Search by name, code or subscriber ID..."
        />

        {/* Navigation/Pagination */}
        <DataTablePagination />

        {/* Table */}
        <DataTable
          columns={columns}
          onRowClick={(row) => openEditModal(row.company_code)}
          emptyMessage="No companies found"
          striped={true}
          hoverable={true}
          stickyHeader={true}
        />

        {/* Footer */}
        <DataTablePagination />
      </DataTableProvider>

      {/* Add Company Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Company"
        size="lg"
      >
        <CompanyForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          company={{
            subscriber_id: "",
            company_code: "",
            company_name: "",
            company_type: "",
            currency_mode: "",
            currency_time: "",
            country_type: "",
            country_code: "",
            category_code1: "",
            category_code2: "",
            current_fiscal_year: "",
            current_period: "",
            fiscal_start_period: "",
            fiscal_end_period: "",
            no_printing: "",
            special_handling: "",
            no_52_period: "",
            capital_reports: "",
            maturity_calc_type: "",
            detail_level: "",
            unit_number: "",
            year_code: "",
            fiscal_setting: "",
            currency_code: "",
            date_format: "",
            company_country: "",
            fiscal_period_pattern: "",
            calendar_type: "",
            company_prefix: "",
            // System fields would typically be automatically set
          }}
        />
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentCompany(null);
        }}
        title="Edit Company"
        size="lg"
      >
        {currentCompany && (
          <CompanyForm
            company={currentCompany}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setCurrentCompany(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${
          selectedRows.length
        } selected ${selectedRows.length === 1 ? "company" : "companies"}?`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
