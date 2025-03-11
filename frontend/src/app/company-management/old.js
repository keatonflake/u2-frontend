// app/companies/page.jsx (or wherever your page is located)
import { getAllCompanies } from "@/lib/CompanyManagement"; // Updated import path
import CompaniesTable from "@/components/CompaniesTableClient"; // Updated component name

export default async function CompaniesPage() {
  // Fetch companies data on the server
  const companies = await getAllCompanies();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 bg-blue-900 text-white">
        <h1 className="text-xl font-semibold">Company Management</h1>
      </div>

      {/* Pass server data to client component */}
      <CompaniesTable initialCompanies={companies.data || []} />
      {/* Note: we're extracting companies.data since your API returns { success, message, data } */}
    </div>
  );
}
