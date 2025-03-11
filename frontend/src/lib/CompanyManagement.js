// lib/CompanyManagement.js - API functions for Companies
const U2V1_API_URL =
  process.env.NEXT_PUBLIC_U2V1_API_URL || process.env.U2V1_API_URL;
const U2V1_API_KEY =
  process.env.NEXT_PUBLIC_U2V1_API_KEY || process.env.U2V1_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "x-api-key": U2V1_API_KEY,
};

// Helper function to handle API responses
async function handleResponse(response) {
  // Check if response is OK
  if (!response.ok) {
    // Get the response text
    const errorText = await response.text();

    // Try to parse as JSON first
    try {
      if (
        errorText.trim().startsWith("{") ||
        errorText.trim().startsWith("[")
      ) {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `API error: ${response.status}`);
      }
    } catch (e) {
      // If not JSON or other parsing error, create a generic error message
      const errorMatch = errorText.match(/<title>(.*?)<\/title>/);
      throw new Error(
        errorMatch ? errorMatch[1] : `API error: ${response.status}`
      );
    }

    // Fallback error if we couldn't parse anything
    throw new Error(`API request failed with status ${response.status}`);
  }

  // Parse successful response
  const responseText = await response.text();

  // Guard against empty responses
  if (!responseText) {
    return { data: [] };
  }

  // Try to parse as JSON
  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    throw new Error("Invalid JSON response from API");
  }
}

// Get all companies
export async function getAllCompanies() {
  try {
    const response = await fetch(`${U2V1_API_URL}/companies`, {
      method: "GET",
      headers,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw error;
  }
}

// Get a single company by ID
export async function getCompany(id) {
  try {
    const response = await fetch(`${U2V1_API_URL}/companies/${id}`, {
      method: "GET",
      headers,
      mode: "cors",
      cache: "no-cache",
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch company ${id}:`, error);
    throw error;
  }
}

// Create a new company
export async function createCompany(companyData) {
  try {
    const response = await fetch(`${U2V1_API_URL}/companies`, {
      method: "POST",
      headers,
      mode: "cors",
      body: JSON.stringify(companyData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Failed to create company:", error);
    throw error;
  }
}

// Update an existing company
export async function updateCompany(id, companyData) {
  try {
    const response = await fetch(`${U2V1_API_URL}/companies/${id}`, {
      method: "PUT",
      headers,
      mode: "cors",
      body: JSON.stringify(companyData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to update company ${id}:`, error);
    throw error;
  }
}

// Delete a company
export async function deleteCompany(id) {
  try {
    const response = await fetch(`${U2V1_API_URL}/companies/${id}`, {
      method: "DELETE",
      headers,
      mode: "cors",
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to delete company ${id}:`, error);
    throw error;
  }
}
