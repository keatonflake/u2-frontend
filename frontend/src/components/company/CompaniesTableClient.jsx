"use client";

import CompaniesTable from "./CompaniesTable";

// This is a simple wrapper to make the component a Client Component
// This pattern is useful when you want to use server components for
// data fetching but need client interactivity
export default function CompaniesTableClient({ initialCompanies }) {
  return <CompaniesTable initialCompanies={initialCompanies} />;
}
