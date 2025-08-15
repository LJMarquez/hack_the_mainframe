// class GameAPI {
//   constructor() {
//     // this.baseURL = window.CONFIG.API_ENDPOINT
//     this.baseURL = CONFIG.API_ENDPOINT

//     this.retryAttempts = 3
//     this.retryDelay = 1000 // 1 second
//   }

//   /**
//    * Submit a player's score to the Google Apps Script API
//    * @param {string} playerName - The player's name
//    * @param {string} completionTime - The completion time in seconds (as string)
//    * @returns {Promise<Object>} API response
//    */
//   async submitScore(playerName, completionTime) {
//     const payload = {
//       name: playerName.trim(),
//       time: Number.parseFloat(completionTime),
//     }

//     console.log("Submitting score:", payload)

//     try {
//       const response = await this.makeRequest("POST", payload)

//       if (response.status === "success") {
//         console.log("[v0] Score submitted successfully:", response)
//         return response
//       } else {
//         throw new Error(response.message || "Failed to submit score")
//       }
//     } catch (error) {
//       console.error("[v0] Error submitting score:", error)
//       throw error
//     }
//   }

//   /**
//    * Get the current leaderboard from Google Apps Script API
//    * @returns {Promise<Array>} Array of leaderboard entries
//    */
//   async getLeaderboard() {
//     console.log("Fetching leaderboard data")

//     try {
//       const response = await this.makeRequest("GET")

//       if (Array.isArray(response)) {
//         console.log("[v0] Leaderboard fetched successfully:", response.length, "entries")
//         return response
//       } else {
//         throw new Error("Invalid leaderboard response format")
//       }
//     } catch (error) {
//       console.error("[v0] Error fetching leaderboard:", error)
//       throw error
//     }
//   }

//   /**
//    * Make HTTP request to Google Apps Script with retry logic
//    * @param {string} method - HTTP method (GET, POST)
//    * @param {Object} data - Request payload (for POST requests)
//    * @returns {Promise<Object>} API response
//    */
//   async makeRequest(method, data = null) {
//     const url = this.baseURL

//     // Validate API endpoint is configured
//     if (!this.baseURL || this.baseURL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
//       throw new Error("Google Apps Script API endpoint not configured. Please update js/config.js")
//     }

//     const requestOptions = {
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       mode: "cors", // Enable CORS for cross-origin requests
//     }

//     // Add body for POST requests
//     if (method === "POST" && data) {
//       requestOptions.body = JSON.stringify(data)
//     }

//     // Retry logic
//     for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
//       try {
//         console.log(`[v0] API Request (attempt ${attempt}):`, method, url)

//         const response = await fetch(url, requestOptions)

//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//         }

//         const result = await response.json()
//         console.log("[v0] API Response:", result)

//         return result
//       } catch (error) {
//         console.error(`[v0] API Request failed (attempt ${attempt}):`, error.message)

//         // If this is the last attempt, throw the error
//         if (attempt === this.retryAttempts) {
//           throw new Error(`API request failed after ${this.retryAttempts} attempts: ${error.message}`)
//         }

//         // Wait before retrying
//         await this.delay(this.retryDelay * attempt) // Exponential backoff
//       }
//     }
//   }

//   /**
//    * Utility function to create delays
//    * @param {number} ms - Milliseconds to delay
//    * @returns {Promise}
//    */
//   delay(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms))
//   }

//   /**
//    * Test the API connection
//    * @returns {Promise<boolean>} True if connection is successful
//    */
//   async testConnection() {
//     try {
//       console.log("[v0] Testing API connection...")

//       // Try to fetch leaderboard as a connection test
//       await this.getLeaderboard()
//       console.log("[v0] API connection test successful")
//       return true
//     } catch (error) {
//       console.error("[v0] API connection test failed:", error.message)
//       return false
//     }
//   }

//   /**
//    * Get API status and configuration info
//    * @returns {Object} API status information
//    */
//   getStatus() {
//     return {
//       configured: this.baseURL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE",
//       baseURL: this.baseURL,
//       retryAttempts: this.retryAttempts,
//       retryDelay: this.retryDelay,
//     }
//   }
// }

// // Initialize API when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("[v0] Initializing Game API")
//   window.GameAPI = new GameAPI()

//   // Test connection if API is configured
//   const status = window.GameAPI.getStatus()
//   if (status.configured) {
//     window.GameAPI.testConnection().catch((error) => {
//       console.warn("[v0] Initial API connection test failed:", error.message)
//     })
//   } else {
//     console.warn("[v0] Google Apps Script API not configured. Please update js/config.js")
//   }
// })

// // Export for use in other modules
// if (typeof window !== "undefined") {
//   window.GameAPI = window.GameAPI || new GameAPI()
// }


class GameAPI {
  constructor() {
    this.baseURL = CONFIG.API_ENDPOINT;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async submitScore(playerName, completionTime) {
    const payload = {
      name: playerName.trim(),
      time: parseFloat(completionTime),
    };

    try {
      const response = await this.makeRequest("POST", payload);
      if (response.status === "success") return response;
      else throw new Error(response.message || "Failed to submit score");
    } catch (error) {
      console.error("[v0] Error submitting score:", error);
      throw error;
    }
  }

  async getLeaderboard() {
    try {
      const response = await this.makeRequest("GET");
      if (Array.isArray(response)) return response;
      else throw new Error(response.message || "Invalid leaderboard format");
    } catch (error) {
      console.error("[v0] Error fetching leaderboard:", error);
      throw error;
    }
  }

  async makeRequest(method, data = null) {
    if (!this.baseURL || this.baseURL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      throw new Error("API endpoint not configured");
    }

    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (method === "POST") options.body = JSON.stringify(data);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const res = await fetch(this.baseURL, options);
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          throw new Error("Invalid JSON received from API");
        }

        if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
        return json;
      } catch (err) {
        if (attempt === this.retryAttempts) throw err;
        await new Promise((r) => setTimeout(r, this.retryDelay * attempt));
      }
    }
  }

  async testConnection() {
    try {
      await this.getLeaderboard();
      console.log("[v0] API connection test successful");
      return true;
    } catch (err) {
      console.error("[v0] API connection test failed:", err.message);
      return false;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.GameAPI = new GameAPI();
  if (window.GameAPI.baseURL) window.GameAPI.testConnection();
});
