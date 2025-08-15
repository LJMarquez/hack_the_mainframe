// Main application initialization
class MainApp {
  constructor() {
    this.gameManager = new window.GameManager() // Declare GameManager
    this.currentPlayer = ""

    // DOM elements
    this.nameModal = document.getElementById("nameModal")
    this.playerNameInput = document.getElementById("playerName")
    this.startGameButton = document.getElementById("startGame")

    this.initializeEventListeners()
    this.showNameModal()
  }

  initializeEventListeners() {
    // Start game button
    this.startGameButton.addEventListener("click", () => {
      this.handleStartGame()
    })

    // Enter key in name input
    this.playerNameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleStartGame()
      }
    })

    // Auto-focus name input when modal is shown
    this.playerNameInput.addEventListener("focus", () => {
      // Scroll to top on mobile to ensure modal is visible
      window.scrollTo(0, 0)
    })

    // Prevent form submission
    document.addEventListener("submit", (e) => {
      e.preventDefault()
    })

    // Handle visibility change (for mobile app switching)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.gameManager.isGameActive) {
        console.log("[v0] Game paused due to visibility change")
      }
    })
  }

  showNameModal() {
    this.nameModal.classList.remove("hidden")
    // Focus input after a brief delay to ensure modal is rendered
    setTimeout(() => {
      this.playerNameInput.focus()
    }, 100)
  }

  hideNameModal() {
    this.nameModal.classList.add("hidden")
  }

  handleStartGame() {
    const playerName = this.playerNameInput.value.trim()

    if (!this.validatePlayerName(playerName)) {
      this.showNameError("Enter a valid agent codename (1-20 characters)")
      return
    }

    this.currentPlayer = playerName
    this.hideNameModal()

    // Add dramatic pause before starting
    setTimeout(() => {
      this.gameManager.startGame(playerName)
    }, 500)

    console.log("Starting game for player:", playerName)
  }

  validatePlayerName(name) {
    const CONFIG = window.CONFIG // Declare CONFIG
    return name.length >= 1 && name.length <= CONFIG.GAME_SETTINGS.MAX_NAME_LENGTH
  }

  showNameError(message) {
    // Remove existing error
    const existingError = document.querySelector(".name-error")
    if (existingError) {
      existingError.remove()
    }

    // Create error element
    const errorElement = document.createElement("div")
    errorElement.className = "error-message name-error"
    errorElement.textContent = message

    // Insert after input
    this.playerNameInput.parentNode.insertBefore(errorElement, this.startGameButton)

    // Remove error after 3 seconds
    setTimeout(() => {
      errorElement.remove()
    }, 3000)

    // Shake animation for input
    this.playerNameInput.style.animation = "shake 0.5s ease-in-out"
    setTimeout(() => {
      this.playerNameInput.style.animation = ""
    }, 500)
  }

  // Reset application state
  reset() {
    this.gameManager.reset()
    this.playerNameInput.value = ""
    this.showNameModal()
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Initializing Hack the Mainframe game")
  window.mainApp = new MainApp()
})

// Handle page unload
window.addEventListener("beforeunload", (e) => {
  if (window.mainApp && window.mainApp.gameManager.isGameActive) {
    e.preventDefault()
    e.returnValue = "Game in progress. Are you sure you want to leave?"
  }
})