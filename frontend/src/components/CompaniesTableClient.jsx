// components/CompaniesTable.jsx
"use client";

import { useState } from "react";
import {
  Search,
  Printer,
  Download,
  FileText,
  Plus,
  Trash,
  Edit,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/lib/CompanyManagement"; // Import API functions

export default function CompaniesTable({ initialCompanies = [] }) {
  // State for storing and managing companies data
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);

  // Filtered companies based on search
  const filteredCompanies = searchTerm
    ? companies.filter(
        (company) =>
          company.company_code
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          company.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : companies;

  // Handler for row selection
  const toggleSelectAll = () => {
    if (selectedRows.length === companies.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(companies.map((company) => company.company_code));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handler for adding a new company
  const handleAddCompany = async (companyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createCompany(companyData); // Use your API function
      const newCompany = result.data; // Extract company from response

      setCompanies([...companies, newCompany]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add company:", error);
      setError(error.message || "Failed to add company");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for editing a company
  const handleEditCompany = async (companyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateCompany(companyData.company_code, companyData); // Use your API function
      const updatedCompany = result.data; // Extract company from response

      setCompanies(
        companies.map((company) =>
          company.company_code === updatedCompany.company_code
            ? updatedCompany
            : company
        )
      );
      setIsEditModalOpen(false);
      setCurrentCompany(null);
    } catch (error) {
      console.error("Failed to update company:", error);
      setError(error.message || "Failed to update company");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for deleting companies
  const handleDeleteCompanies = async () => {
    if (selectedRows.length === 0) return;

    setIsLoading(true);
    setError(null);
    try {
      // Delete multiple companies in parallel using your API function
      await Promise.all(selectedRows.map((id) => deleteCompany(id)));

      // Update local state by filtering out deleted companies
      setCompanies(
        companies.filter(
          (company) => !selectedRows.includes(company.company_code)
        )
      );
      setSelectedRows([]);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete companies:", error);
      setError(error.message || "Failed to delete companies");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for opening the edit modal
  const handleOpenEditModal = (company) => {
    setCurrentCompany(company);
    setIsEditModalOpen(true);
  };

  // Render error message if there is one
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <h3 className="text-lg font-medium">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border shadow-sm">
      {/* Toolbar */}
      <div className="bg-white border-b p-2 flex items-center space-x-2">
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} />
        </button>
        <button
          className={`p-2 rounded ${
            selectedRows.length !== 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          disabled={selectedRows.length !== 1}
          onClick={() => {
            if (selectedRows.length === 1) {
              const selectedCompany = companies.find(
                (c) => c.company_code === selectedRows[0]
              );
              handleOpenEditModal(selectedCompany);
            }
          }}
        >
          <Edit size={20} />
        </button>
        <button
          className={`p-2 rounded ${
            selectedRows.length === 0
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          disabled={selectedRows.length === 0}
          onClick={() => setIsDeleteConfirmOpen(true)}
        >
          <Trash size={20} />
        </button>
        <span className="w-px h-6 bg-gray-300 mx-1"></span>
        <button className="p-2 rounded hover:bg-gray-100">
          <FileText size={20} />
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <Filter size={20} />
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <Printer size={20} />
        </button>
        <button className="p-2 rounded hover:bg-gray-100">
          <Download size={20} />
        </button>

        <div className="flex items-center ml-auto relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg px-3 py-1 pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="absolute left-2 text-gray-500" />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 bg-gray-100 flex items-center text-sm">
        <span>Records 1 - {filteredCompanies.length}</span>
        <div className="ml-auto flex items-center space-x-2">
          <button className="p-1 rounded hover:bg-gray-200">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1 rounded hover:bg-gray-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th className="w-10 p-2 sticky top-0 bg-gray-50">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={
                      selectedRows.length === companies.length &&
                      companies.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Co Code
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Company Name
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Type
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Curr Mode
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Curr Time
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Country Type
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Country Code
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Cat Code 1
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Cat Code 2
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Fiscal Year
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Current Period
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Fiscal Start
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Fiscal End
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  No Printing
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Special Handling
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  No 52 Period
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Capital Reports
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Maturity Calc
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Detail Level
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Unit Number
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Year Code
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Fiscal Setting
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Currency Code
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Date Format
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Country
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Fiscal Period Pattern
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Calendar Type
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Company Prefix
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Created By
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Created Program
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Created Date
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Updated By
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Updated Program
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Updated Date
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Updated Time
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Job Name
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Sys Created By
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Sys Creation Date
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Sys Updated By
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Sys Update Date
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Is Deleted
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Deleted Date
                </th>
                <th className="p-2 text-left font-medium sticky top-0 bg-gray-50">
                  Deleted By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredCompanies.map((company) => (
                <tr
                  key={company.company_code}
                  className={`hover:bg-blue-50 ${
                    selectedRows.includes(company.company_code)
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => toggleSelectRow(company.company_code)}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedRows.includes(company.company_code)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="p-2">{company.company_code}</td>
                  <td className="p-2">{company.company_name}</td>
                  <td className="p-2">{company.company_type}</td>
                  <td className="p-2">{company.currency_mode}</td>
                  <td className="p-2">{company.currency_time}</td>
                  <td className="p-2">{company.country_type}</td>
                  <td className="p-2">{company.country_code}</td>
                  <td className="p-2">{company.category_code1}</td>
                  <td className="p-2">{company.category_code2}</td>
                  <td className="p-2">{company.current_fiscal_year}</td>
                  <td className="p-2">{company.current_period}</td>
                  <td className="p-2">{company.fiscal_start_period}</td>
                  <td className="p-2">{company.fiscal_end_period}</td>
                  <td className="p-2">{company.no_printing}</td>
                  <td className="p-2">{company.special_handling}</td>
                  <td className="p-2">{company.no_52_period}</td>
                  <td className="p-2">{company.capital_reports}</td>
                  <td className="p-2">{company.maturity_calc_type}</td>
                  <td className="p-2">{company.detail_level}</td>
                  <td className="p-2">{company.unit_number}</td>
                  <td className="p-2">{company.year_code}</td>
                  <td className="p-2">{company.fiscal_setting}</td>
                  <td className="p-2">{company.currency_code}</td>
                  <td className="p-2">{company.date_format}</td>
                  <td className="p-2">{company.company_country}</td>
                  <td className="p-2">{company.fiscal_period_pattern}</td>
                  <td className="p-2">{company.calendar_type}</td>
                  <td className="p-2">{company.company_prefix}</td>
                  <td className="p-2">{company.created_by}</td>
                  <td className="p-2">{company.created_program}</td>
                  <td className="p-2">
                    {company.created_date
                      ? new Date(company.created_date).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">{company.updated_by}</td>
                  <td className="p-2">{company.updated_program}</td>
                  <td className="p-2">
                    {company.updated_date
                      ? new Date(company.updated_date).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">{company.updated_time}</td>
                  <td className="p-2">{company.job_name}</td>
                  <td className="p-2">{company.system_created_by}</td>
                  <td className="p-2">
                    {company.system_creation_date
                      ? new Date(
                          company.system_creation_date
                        ).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">{company.system_updated_by}</td>
                  <td className="p-2">
                    {company.system_update_date
                      ? new Date(
                          company.system_update_date
                        ).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">{company.is_deleted ? "Yes" : "No"}</td>
                  <td className="p-2">
                    {company.deleted_date
                      ? new Date(company.deleted_date).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2">{company.deleted_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 bg-gray-100 text-right text-sm">
        <span>
          Showing {filteredCompanies.length} of {companies.length} records
        </span>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <CompanyModal
          title="Add New Company"
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCompany}
          isLoading={isLoading}
          company={{
            company_name: "",
            company_type: "",
            company_country: "",
            currency_code: "",
            date_format: "",
            current_fiscal_year: "",
            current_period: "",
            fiscal_start_period: "",
            fiscal_end_period: "",
            currency_mode: "",
            currency_time: "",
            country_type: "",
            country_code: "",
            category_code1: "",
            category_code2: "",
            no_printing: "",
            special_handling: "",
            no_52_period: "",
            capital_reports: "",
            maturity_calc_type: "",
            detail_level: "",
            unit_number: "",
            year_code: "",
            fiscal_setting: "",
            fiscal_period_pattern: "",
            calendar_type: "",
            company_prefix: "",
            created_by: "",
            created_program: "",
            updated_by: "",
            updated_program: "",
            updated_time: "",
            job_name: "",
            system_created_by: "",
            system_updated_by: "",
            is_deleted: false,
          }}
        />
      )}

      {/* Edit Company Modal */}
      {isEditModalOpen && currentCompany && (
        <CompanyModal
          title="Edit Company"
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentCompany(null);
          }}
          onSubmit={handleEditCompany}
          isLoading={isLoading}
          company={currentCompany}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete {selectedRows.length} selected{" "}
              {selectedRows.length === 1 ? "company" : "companies"}?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDeleteCompanies}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Company Modal Component for Add/Edit operations
function CompanyModal({ title, onClose, onSubmit, isLoading, company }) {
  const [formData, setFormData] = useState({
    company_code: company.company_code || "",
    company_name: company.company_name || "",
    company_type: company.company_type || "",
    company_country: company.company_country || "",
    currency_code: company.currency_code || "",
    date_format: company.date_format || "",
    current_fiscal_year: company.current_fiscal_year || "",
    current_period: company.current_period || "",
    fiscal_start_period: company.fiscal_start_period || "",
    fiscal_end_period: company.fiscal_end_period || "",
    currency_mode: company.currency_mode || "",
    currency_time: company.currency_time || "",
    country_code: company.country_code || "",
    country_type: company.country_type || "",
    fiscal_period_pattern: company.fiscal_period_pattern || "",
    calendar_type: company.calendar_type || "",
    company_prefix: company.company_prefix || "",
    category_code1: company.category_code1 || "",
    category_code2: company.category_code2 || "",
    no_printing: company.no_printing || "",
    special_handling: company.special_handling || "",
    no_52_period: company.no_52_period || "",
    capital_reports: company.capital_reports || "",
    maturity_calc_type: company.maturity_calc_type || "",
    detail_level: company.detail_level || "",
    unit_number: company.unit_number || "",
    year_code: company.year_code || "",
    fiscal_setting: company.fiscal_setting || "",
    created_by: company.created_by || "",
    created_program: company.created_program || "",
    updated_by: company.updated_by || "",
    updated_program: company.updated_program || "",
    updated_time: company.updated_time || "",
    job_name: company.job_name || "",
    system_created_by: company.system_created_by || "",
    system_updated_by: company.system_updated_by || "",
    is_deleted: company.is_deleted || false,
    deleted_date: company.deleted_date || "",
    deleted_by: company.deleted_by || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Code
                </label>
                <input
                  type="text"
                  name="company_code"
                  value={formData.company_code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  disabled={!!company.company_code}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Type
                </label>
                <input
                  type="text"
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Location and Currency */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Location and Currency
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country Code
                </label>
                <input
                  type="text"
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country Type
                </label>
                <input
                  type="text"
                  name="country_type"
                  value={formData.country_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Country
                </label>
                <input
                  type="text"
                  name="company_country"
                  value={formData.company_country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency Code
                </label>
                <input
                  type="text"
                  name="currency_code"
                  value={formData.currency_code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency Mode
                </label>
                <input
                  type="text"
                  name="currency_mode"
                  value={formData.currency_mode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency Time
                </label>
                <input
                  type="text"
                  name="currency_time"
                  value={formData.currency_time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Fiscal Settings */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Fiscal Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Fiscal Year
                </label>
                <input
                  type="text"
                  name="current_fiscal_year"
                  value={formData.current_fiscal_year}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Period
                </label>
                <input
                  type="text"
                  name="current_period"
                  value={formData.current_period}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiscal Start Period
                </label>
                <input
                  type="text"
                  name="fiscal_start_period"
                  value={formData.fiscal_start_period}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiscal End Period
                </label>
                <input
                  type="text"
                  name="fiscal_end_period"
                  value={formData.fiscal_end_period}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiscal Period Pattern
                </label>
                <input
                  type="text"
                  name="fiscal_period_pattern"
                  value={formData.fiscal_period_pattern}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiscal Setting
                </label>
                <input
                  type="text"
                  name="fiscal_setting"
                  value={formData.fiscal_setting}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year Code
                </label>
                <input
                  type="text"
                  name="year_code"
                  value={formData.year_code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Additional Settings
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <input
                  type="text"
                  name="date_format"
                  value={formData.date_format}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Calendar Type
                </label>
                <input
                  type="text"
                  name="calendar_type"
                  value={formData.calendar_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Prefix
                </label>
                <input
                  type="text"
                  name="company_prefix"
                  value={formData.company_prefix}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Code 1
                </label>
                <input
                  type="text"
                  name="category_code1"
                  value={formData.category_code1}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Code 2
                </label>
                <input
                  type="text"
                  name="category_code2"
                  value={formData.category_code2}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit Number
                </label>
                <input
                  type="text"
                  name="unit_number"
                  value={formData.unit_number}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Detail Level
                </label>
                <input
                  type="text"
                  name="detail_level"
                  value={formData.detail_level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maturity Calc Type
                </label>
                <input
                  type="text"
                  name="maturity_calc_type"
                  value={formData.maturity_calc_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* System Flags */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">System Flags</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="no_printing"
                  name="no_printing"
                  checked={formData.no_printing === "Y"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      no_printing: e.target.checked ? "Y" : "N",
                    })
                  }
                  className="h-4 w-4 mr-2"
                />
                <label
                  htmlFor="no_printing"
                  className="text-sm font-medium text-gray-700"
                >
                  No Printing
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="special_handling"
                  name="special_handling"
                  checked={formData.special_handling === "Y"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      special_handling: e.target.checked ? "Y" : "N",
                    })
                  }
                  className="h-4 w-4 mr-2"
                />
                <label
                  htmlFor="special_handling"
                  className="text-sm font-medium text-gray-700"
                >
                  Special Handling
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="no_52_period"
                  name="no_52_period"
                  checked={formData.no_52_period === "Y"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      no_52_period: e.target.checked ? "Y" : "N",
                    })
                  }
                  className="h-4 w-4 mr-2"
                />
                <label
                  htmlFor="no_52_period"
                  className="text-sm font-medium text-gray-700"
                >
                  No 52 Period
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="capital_reports"
                  name="capital_reports"
                  checked={formData.capital_reports === "Y"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capital_reports: e.target.checked ? "Y" : "N",
                    })
                  }
                  className="h-4 w-4 mr-2"
                />
                <label
                  htmlFor="capital_reports"
                  className="text-sm font-medium text-gray-700"
                >
                  Capital Reports
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_deleted"
                  name="is_deleted"
                  checked={formData.is_deleted}
                  onChange={handleChange}
                  className="h-4 w-4 mr-2"
                />
                <label
                  htmlFor="is_deleted"
                  className="text-sm font-medium text-gray-700"
                >
                  Is Deleted
                </label>
              </div>
            </div>
          </div>

          {/* System Information - Readonly fields */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              System Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created By
                </label>
                <input
                  type="text"
                  name="created_by"
                  value={formData.created_by}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.created_by}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created Program
                </label>
                <input
                  type="text"
                  name="created_program"
                  value={formData.created_program}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.created_program}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <input
                  type="text"
                  name="created_date"
                  value={
                    company.created_date
                      ? new Date(company.created_date).toLocaleDateString()
                      : ""
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated By
                </label>
                <input
                  type="text"
                  name="updated_by"
                  value={formData.updated_by}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.updated_by}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated Program
                </label>
                <input
                  type="text"
                  name="updated_program"
                  value={formData.updated_program}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.updated_program}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated Date
                </label>
                <input
                  type="text"
                  name="updated_date"
                  value={
                    company.updated_date
                      ? new Date(company.updated_date).toLocaleDateString()
                      : ""
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  System Created By
                </label>
                <input
                  type="text"
                  name="system_created_by"
                  value={formData.system_created_by}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.system_created_by}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  System Creation Date
                </label>
                <input
                  type="text"
                  name="system_creation_date"
                  value={
                    company.system_creation_date
                      ? new Date(
                          company.system_creation_date
                        ).toLocaleDateString()
                      : ""
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated Time
                </label>
                <input
                  type="text"
                  name="updated_time"
                  value={formData.updated_time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.updated_time}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Name
                </label>
                <input
                  type="text"
                  name="job_name"
                  value={formData.job_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.job_name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deleted By
                </label>
                <input
                  type="text"
                  name="deleted_by"
                  value={formData.deleted_by}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly={!!company.deleted_by}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deleted Date
                </label>
                <input
                  type="text"
                  name="deleted_date"
                  value={
                    company.deleted_date
                      ? new Date(company.deleted_date).toLocaleDateString()
                      : ""
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
