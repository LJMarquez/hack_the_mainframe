// Configuration file for the Hack the Mainframe game
const CONFIG = {
  // Google Apps Script API endpoint (to be configured by user)
  API_ENDPOINT: "https://script.google.com/macros/s/AKfycbxEvj9Vd3dleUhPnhPtpCLku-hnMsitvBvgEqlCBi61ViCYRdkXBwdnShc_qijWcVk05Q/exec",

  // Admin password (change this!)
  ADMIN_PASSWORD: "hacktheplanet",

  // Game settings
  GAME_SETTINGS: {
    AUTO_REFRESH_INTERVAL: 5000, // 5 seconds for leaderboard
    MAX_NAME_LENGTH: 20,
    GAMES: ["typing", "pattern", "target"], // Available minigames
    DIFFICULTY_SCALING: true,
  },

  // API endpoints
  ENDPOINTS: {
    SUBMIT_SCORE: "/submit",
    GET_LEADERBOARD: "/leaderboard",
  },
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG
}