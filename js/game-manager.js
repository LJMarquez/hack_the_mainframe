// Game Manager - Coordinates game flow and minigames
class GameManager {
  constructor() {
    this.currentPlayer = ""
    this.timer = new window.GameTimer() // Declare GameTimer variable
    this.currentGameIndex = 0
    this.games = []
    this.gameSequence = []
    this.isGameActive = false

    // DOM elements
    this.gameContainer = document.getElementById("gameContainer")
    this.gameStatus = document.getElementById("gameStatus")
    this.gameContent = document.getElementById("gameContent")
    this.successModal = document.getElementById("successModal")
    this.successName = document.getElementById("successName")
    this.successTime = document.getElementById("successTime")
  }

  initializeGames() {
    // Initialize available games (will be implemented in next task)
    this.games = [
      { name: "typing", class: window.TypingChallenge },
      { name: "pattern", class: window.PatternMatching },
      { name: "target", class: window.TargetClicking },
    ]

    // Create random sequence of 3 games
    this.gameSequence = this.shuffleArray([...this.games]).slice(0, 3)
    console.log(
      "[v0] Game sequence:",
      this.gameSequence.map((g) => g.name),
    )
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  startGame(playerName) {
    this.currentPlayer = playerName
    this.currentGameIndex = 0
    this.isGameActive = true

    // Show game container
    this.gameContainer.classList.remove("hidden")

    // Initialize games and start timer
    this.initializeGames()
    this.timer.start()

    // Start first minigame
    this.startNextMinigame()
  }

  startNextMinigame() {
    if (this.currentGameIndex >= this.gameSequence.length) {
      this.completeGame()
      return
    }

    const currentGame = this.gameSequence[this.currentGameIndex]
    this.updateStatus(`Initiating ${currentGame.name.toUpperCase()} protocol... (${this.currentGameIndex + 1}/3)`)

    // Clear previous game content
    this.gameContent.innerHTML = ""

    // Start the minigame after a brief delay
    setTimeout(() => {
      this.loadMinigame(currentGame)
    }, 1000)
  }

  loadMinigame(gameConfig) {
    try {
      if (!gameConfig.class) {
        console.error("[v0] Game class not found:", gameConfig.name)
        this.handleGameError()
        return
      }

      const gameInstance = new gameConfig.class(this.gameContent)
      gameInstance.onComplete = () => this.onMinigameComplete()
      gameInstance.onError = () => this.handleGameError()
      gameInstance.start()

      this.updateStatus(`${gameConfig.name.toUpperCase()} ACTIVE - Complete the challenge!`)
    } catch (error) {
      console.error("[v0] Error loading minigame:", error)
      this.handleGameError()
    }
  }

  onMinigameComplete() {
    this.currentGameIndex++

    if (this.currentGameIndex < this.gameSequence.length) {
      this.updateStatus("Protocol completed. Advancing to next stage...")
      setTimeout(() => {
        this.startNextMinigame()
      }, 1500)
    } else {
      this.completeGame()
    }
  }

  completeGame() {
    const finalTime = this.timer.stop()
    this.isGameActive = false

    // Submit score to API
    this.submitScore(this.currentPlayer, finalTime)

    // Show success modal
    this.showSuccessModal(finalTime)
  }

  async submitScore(playerName, time) {
    try {
      // This will be implemented in the API integration task
      console.log("[v0] Submitting score:", { playerName, time })

      // Placeholder for API call
      if (window.GameAPI) {
        await window.GameAPI.submitScore(playerName, time)
      }
    } catch (error) {
      console.error("[v0] Error submitting score:", error)
    }
  }

  showSuccessModal(time) {
    this.successName.textContent = this.currentPlayer
    this.successTime.textContent = time
    this.successModal.classList.remove("hidden")

    // Add matrix rain effect
    this.createMatrixRain()

    // Auto-reload after 10 seconds
    setTimeout(() => {
      window.location.reload()
    }, 10000)
  }

  createMatrixRain() {
    const matrixContainer = document.querySelector(".matrix-rain")
    if (!matrixContainer) return

    const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

    for (let i = 0; i < 20; i++) {
      const column = document.createElement("div")
      column.className = "matrix-column"
      column.style.left = `${Math.random() * 100}%`
      column.style.animationDelay = `${Math.random() * 2}s`
      column.style.animationDuration = `${2 + Math.random() * 3}s`

      for (let j = 0; j < 10; j++) {
        const char = document.createElement("span")
        char.textContent = characters[Math.floor(Math.random() * characters.length)]
        char.style.opacity = Math.random()
        column.appendChild(char)
      }

      matrixContainer.appendChild(column)
    }
  }

  handleGameError() {
    this.updateStatus("System error detected. Retrying...")
    setTimeout(() => {
      this.startNextMinigame()
    }, 2000)
  }

  updateStatus(message) {
    this.gameStatus.innerHTML = `<p>${message}</p>`
  }

  reset() {
    this.timer.reset()
    this.currentGameIndex = 0
    this.isGameActive = false
    this.gameContainer.classList.add("hidden")
    this.successModal.classList.add("hidden")
  }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.GameManager = GameManager
}
