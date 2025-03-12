// lib/CompanyManagement.js - API functions for Companies
const U2V1_API_URL = process.env.NEXT_PUBLIC_U2V1_API_URL;
const U2V1_API_KEY = process.env.NEXT_PUBLIC_U2V1_API_KEY;

console.log("Environment Variables Debug:");
console.log("API URL:", U2V1_API_URL);
console.log("API Key defined:", !!U2V1_API_KEY);

const headers = {
  "Content-Type": "application/json",
  "x-api-key": U2V1_API_KEY,
};

// Improved helper function to handle API responses
async function handleResponse(response) {
  // Check if response is OK
  if (!response.ok) {
    const contentType = response.headers.get("content-type");

    // If the response is JSON, parse it as JSON
    if (contentType && contentType.includes("application/json")) {
      try {
        const errorJson = await response.json();
        throw new Error(errorJson.message || `API error: ${response.status}`);
      } catch (jsonError) {
        // If JSON parsing fails, fall back to text
        console.error("Error parsing JSON error response:", jsonError);
      }
    }

    // If not JSON or JSON parsing failed, try to get text
    try {
      const errorText = await response.text();

      // Simple check for HTML content
      if (errorText.includes("<html") || errorText.includes("<!DOCTYPE")) {
        throw new Error(`Server returned HTML error (${response.status})`);
      }

      // Try to extract a title if it exists
      const errorMatch = errorText.match(/<title>(.*?)<\/title>/);
      if (errorMatch) {
        throw new Error(errorMatch[1]);
      }

      // Fallback to the error text if it's not empty
      if (errorText.trim()) {
        throw new Error(errorText);
      }
    } catch (textError) {
      // If text parsing also fails, use a generic error
      console.error("Error extracting error text:", textError);
    }

    // Final fallback error
    throw new Error(`API request failed with status ${response.status}`);
  }

  // For successful responses, check content type
  const contentType = response.headers.get("content-type");

  // If it's JSON, parse as JSON
  if (contentType && contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Invalid JSON response from API");
    }
  }

  // If it's not JSON, get the text
  const responseText = await response.text();

  // Guard against empty responses
  if (!responseText) {
    return { data: [] };
  }

  // Try to parse as JSON anyway (some servers don't set content-type correctly)
  try {
    return JSON.parse(responseText);
  } catch (error) {
    // If it's not JSON, return the text
    return { data: responseText };
  }
}

// Common request options to avoid repetition
const commonOptions = {
  mode: "cors",
  cache: "no-cache",
  // Use credentials only when the API is on the same domain or a specific allowed domain
  // If your API is on a different domain and supports '*' for CORS, do not use credentials
  credentials: "same-origin", // Options: 'omit', 'same-origin', 'include'
};

// First verify CORS is working correctly with this test function
export async function testCorsSetup() {
  try {
    console.log(`Testing CORS at: ${U2V1_API_URL}/cors-test`);
    const response = await fetch(`${U2V1_API_URL}/cors-test`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...commonOptions,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("CORS test failed:", error);
    throw error;
  }
}

// Get all companies
export async function getAllCompanies() {
  try {
    console.log(`Fetching companies from: ${U2V1_API_URL}/companies`);
    const response = await fetch(`${U2V1_API_URL}/companies`, {
      method: "GET",
      headers,
      ...commonOptions,
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
      ...commonOptions,
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
      ...commonOptions,
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
      ...commonOptions,
      body: JSON.stringify(companyData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to update company ${id}:`, error);
    throw error;
  }
}

// Delete a single company
export async function deleteCompany(id) {
  try {
    console.log(`Deleting company with ID: ${id}`);
    console.log(`DELETE URL: ${U2V1_API_URL}/companies/${id}`);

    const response = await fetch(`${U2V1_API_URL}/companies/${id}`, {
      method: "DELETE",
      headers,
      ...commonOptions,
    });

    // Detailed logging for debugging
    console.log("Delete Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to delete company ${id}:`, error);
    throw error;
  }
}

// Delete multiple companies in a single request (batch delete)
export async function deleteCompanies(ids) {
  if (!U2V1_API_URL) {
    console.error("API URL is undefined. Check your environment variables.");
    throw new Error("API configuration missing. Contact your administrator.");
  }

  try {
    // Note: The API path in the URL should match your backend configuration
    // Your yaml has /companies/bulk but your client code has /companies/batch-delete
    console.log(`Attempting batch delete with IDs: ${ids.join(", ")}`);
    const deleteUrl = `${U2V1_API_URL}/companies/bulk`;
    console.log(`Batch delete URL: ${deleteUrl}`);

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers,
      ...commonOptions,
      body: JSON.stringify({ ids }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to delete companies: ${ids.join(", ")}`, error);
    throw error;
  }
}
