// Use environment variable or default to localhost for development
// For production, set VITE_API_BASE_URL in your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.pivotal.ag";

export default API_BASE_URL;


