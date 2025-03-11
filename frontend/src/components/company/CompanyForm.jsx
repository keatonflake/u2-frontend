"use client";

import { useState } from "react";

export default function CompanyForm({ company = {}, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    company_code: company.company_code || "",
    company_name: company.company_name || "",
    company_type: company.company_type || "",
    company_country: company.company_country || "",
    currency_code: company.currency_code || "",
    // Add all other fields here
    ...company,
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

  // Group fields into sections for better organization
  const fieldSections = [
    {
      title: "Basic Information",
      fields: [
        {
          name: "company_code",
          label: "Company Code",
          type: "text",
          required: true,
          disabled: !!company.company_code,
          colSpan: 1,
        },
        {
          name: "company_name",
          label: "Company Name",
          type: "text",
          required: true,
          colSpan: 1,
        },
        {
          name: "company_type",
          label: "Company Type",
          type: "text",
          colSpan: 1,
        },
      ],
    },
    {
      title: "Location and Currency",
      fields: [
        {
          name: "country_code",
          label: "Country Code",
          type: "text",
          colSpan: 1,
        },
        {
          name: "country_type",
          label: "Country Type",
          type: "text",
          colSpan: 1,
        },
        {
          name: "company_country",
          label: "Company Country",
          type: "text",
          colSpan: 1,
        },
        {
          name: "currency_code",
          label: "Currency Code",
          type: "text",
          colSpan: 1,
        },
        {
          name: "currency_mode",
          label: "Currency Mode",
          type: "text",
          colSpan: 1,
        },
        {
          name: "currency_time",
          label: "Currency Time",
          type: "text",
          colSpan: 1,
        },
      ],
    },
    {
      title: "Fiscal Settings",
      fields: [
        {
          name: "current_fiscal_year",
          label: "Current Fiscal Year",
          type: "text",
          colSpan: 1,
        },
        {
          name: "current_period",
          label: "Current Period",
          type: "text",
          colSpan: 1,
        },
        {
          name: "fiscal_start_period",
          label: "Fiscal Start Period",
          type: "text",
          colSpan: 1,
        },
        {
          name: "fiscal_end_period",
          label: "Fiscal End Period",
          type: "text",
          colSpan: 1,
        },
        {
          name: "fiscal_period_pattern",
          label: "Fiscal Period Pattern",
          type: "text",
          colSpan: 1,
        },
        {
          name: "fiscal_setting",
          label: "Fiscal Setting",
          type: "text",
          colSpan: 1,
        },
        {
          name: "year_code",
          label: "Year Code",
          type: "text",
          colSpan: 1,
        },
      ],
    },
    // Additional Settings
    {
      title: "Additional Settings",
      fields: [
        {
          name: "date_format",
          label: "Date Format",
          type: "text",
          colSpan: 1,
        },
        {
          name: "calendar_type",
          label: "Calendar Type",
          type: "text",
          colSpan: 1,
        },
        {
          name: "company_prefix",
          label: "Company Prefix",
          type: "text",
          colSpan: 1,
        },
        {
          name: "category_code1",
          label: "Category Code 1",
          type: "text",
          colSpan: 1,
        },
        {
          name: "category_code2",
          label: "Category Code 2",
          type: "text",
          colSpan: 1,
        },
        {
          name: "unit_number",
          label: "Unit Number",
          type: "text",
          colSpan: 1,
        },
        {
          name: "detail_level",
          label: "Detail Level",
          type: "text",
          colSpan: 1,
        },
        {
          name: "maturity_calc_type",
          label: "Maturity Calc Type",
          type: "text",
          colSpan: 1,
        },
      ],
    },
    // System Flags
    {
      title: "System Flags",
      fields: [
        {
          name: "no_printing",
          label: "No Printing",
          type: "checkbox",
          booleanValue: "Y",
          colSpan: 1,
        },
        {
          name: "special_handling",
          label: "Special Handling",
          type: "checkbox",
          booleanValue: "Y",
          colSpan: 1,
        },
        {
          name: "no_52_period",
          label: "No 52 Period",
          type: "checkbox",
          booleanValue: "Y",
          colSpan: 1,
        },
        {
          name: "capital_reports",
          label: "Capital Reports",
          type: "checkbox",
          booleanValue: "Y",
          colSpan: 1,
        },
        {
          name: "is_deleted",
          label: "Is Deleted",
          type: "checkbox",
          colSpan: 1,
        },
      ],
    },
    // System Information - Read-only
    {
      title: "System Information",
      fields: [
        {
          name: "created_by",
          label: "Created By",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "created_program",
          label: "Created Program",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "updated_by",
          label: "Updated By",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "updated_program",
          label: "Updated Program",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "system_created_by",
          label: "System Created By",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "updated_time",
          label: "Updated Time",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "job_name",
          label: "Job Name",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
        {
          name: "deleted_by",
          label: "Deleted By",
          type: "text",
          readonly: true,
          colSpan: 1,
        },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fieldSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">{section.title}</h3>
          <div className="grid grid-cols-3 gap-4">
            {section.fields.map((field) => (
              <div
                key={field.name}
                className={`col-span-${field.colSpan || 1}`}
              >
                {field.type === "checkbox" ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={
                        field.booleanValue
                          ? formData[field.name] === field.booleanValue
                          : formData[field.name]
                      }
                      onChange={(e) => {
                        if (field.booleanValue) {
                          setFormData({
                            ...formData,
                            [field.name]: e.target.checked
                              ? field.booleanValue
                              : "N",
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="h-4 w-4 mr-2"
                      disabled={field.disabled}
                    />
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                  </div>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border
                        ${field.readonly ? "bg-gray-100" : ""}`}
                      required={field.required}
                      disabled={field.disabled}
                      readOnly={field.readonly}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => onCancel?.()}
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
  );
}
