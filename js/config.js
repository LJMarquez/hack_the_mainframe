// Configuration file for the Hack the Mainframe game
const CONFIG = {
  // Google Apps Script API endpoint (to be configured by user)
  API_ENDPOINT: "https://leaderboard-proxy.marquez-leo100.workers.dev",

  // Admin password (change this!)
  ADMIN_PASSWORD: "hacktheplanet",

  // Game settings
  GAME_SETTINGS: {
    AUTO_REFRESH_INTERVAL: 5000, // 5 seconds for leaderboard
    MAX_NAME_LENGTH: 20,
    GAMES: ["typing", "pattern", "target"], // Available minigames
    DIFFICULTY_SCALING: true,
  },
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG
}