const CONFIG = require("./config")

// Google Apps Script API Integration
class GameAPI {
  constructor() {
    // this.baseURL = window.CONFIG.API_ENDPOINT
    // this.endpoints = window.CONFIG.ENDPOINTS
    this.baseURL = CONFIG.API_ENDPOINT
    this.endpoints = CONFIG.ENDPOINTS
    this.retryAttempts = 3
    this.retryDelay = 1000 // 1 second
  }

  /**
   * Submit a player's score to the Google Apps Script API
   * @param {string} playerName - The player's name
   * @param {string} completionTime - The completion time in seconds (as string)
   * @returns {Promise<Object>} API response
   */
  async submitScore(playerName, completionTime) {
    const payload = {
      action: "submit",
      name: playerName.trim(),
      time: Number.parseFloat(completionTime).toFixed(2),
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Submitting score:", payload)

    try {
      const response = await this.makeRequest("POST", this.endpoints.SUBMIT_SCORE, payload)

      if (response.success) {
        console.log("[v0] Score submitted successfully:", response)
        return response
      } else {
        throw new Error(response.error || "Failed to submit score")
      }
    } catch (error) {
      console.error("[v0] Error submitting score:", error)
      throw error
    }
  }

  /**
   * Get the current leaderboard from Google Apps Script API
   * @returns {Promise<Array>} Array of leaderboard entries
   */
  async getLeaderboard() {
    console.log("[v0] Fetching leaderboard data")

    try {
      const response = await this.makeRequest("GET", this.endpoints.GET_LEADERBOARD)

      if (response.success && Array.isArray(response.data)) {
        console.log("[v0] Leaderboard fetched successfully:", response.data.length, "entries")
        return response.data
      } else {
        throw new Error(response.error || "Failed to fetch leaderboard")
      }
    } catch (error) {
      console.error("[v0] Error fetching leaderboard:", error)
      throw error
    }
  }

  /**
   * Make HTTP request to Google Apps Script with retry logic
   * @param {string} method - HTTP method (GET, POST)
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload (for POST requests)
   * @returns {Promise<Object>} API response
   */
  async makeRequest(method, endpoint, data = null) {
    let url = this.baseURL + endpoint // Changed const to let

    // Validate API endpoint is configured
    if (!this.baseURL || this.baseURL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      throw new Error("Google Apps Script API endpoint not configured. Please update js/config.js")
    }

    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors", // Enable CORS for cross-origin requests
    }

    // Add body for POST requests
    if (method === "POST" && data) {
      requestOptions.body = JSON.stringify(data)
    }

    // Add query parameters for GET requests
    if (method === "GET" && data) {
      const params = new URLSearchParams(data)
      url += "?" + params.toString()
    }

    // Retry logic
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`[v0] API Request (attempt ${attempt}):`, method, url)

        const response = await fetch(url, requestOptions)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("[v0] API Response:", result)

        return result
      } catch (error) {
        console.error(`[v0] API Request failed (attempt ${attempt}):`, error.message)

        // If this is the last attempt, throw the error
        if (attempt === this.retryAttempts) {
          throw new Error(`API request failed after ${this.retryAttempts} attempts: ${error.message}`)
        }

        // Wait before retrying
        await this.delay(this.retryDelay * attempt) // Exponential backoff
      }
    }
  }

  /**
   * Utility function to create delays
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Test the API connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      console.log("[v0] Testing API connection...")

      // Try to fetch leaderboard as a connection test
      await this.getLeaderboard()
      console.log("[v0] API connection test successful")
      return true
    } catch (error) {
      console.error("[v0] API connection test failed:", error.message)
      return false
    }
  }

  /**
   * Get API status and configuration info
   * @returns {Object} API status information
   */
  getStatus() {
    return {
      configured: this.baseURL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE",
      baseURL: this.baseURL,
      endpoints: this.endpoints,
      retryAttempts: this.retryAttempts,
      retryDelay: this.retryDelay,
    }
  }
}

// Initialize API when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Game API")
  console.log(CONFIG);
  window.GameAPI = new GameAPI()

  // Test connection if API is configured
  const status = window.GameAPI.getStatus()
  if (status.configured) {
    window.GameAPI.testConnection().catch((error) => {
      console.warn("[v0] Initial API connection test failed:", error.message)
    })
  } else {
    console.warn("[v0] Google Apps Script API not configured. Please update js/config.js")
  }
})

// Export for use in other modules
if (typeof window !== "undefined") {
  window.GameAPI = window.GameAPI || new GameAPI()
}