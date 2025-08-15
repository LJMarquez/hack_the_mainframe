// Timer module for the Hack the Mainframe game
class GameTimer {
  constructor() {
    this.startTime = null
    this.endTime = null
    this.timerInterval = null
    this.isRunning = false
    this.timerElement = document.getElementById("timer")
  }

  start() {
    if (this.isRunning) return

    this.startTime = Date.now()
    this.isRunning = true
    this.updateDisplay()

    // Update timer display every 10ms for smooth animation
    this.timerInterval = setInterval(() => {
      this.updateDisplay()
    }, 10)

    console.log("[v0] Timer started")
  }

  stop() {
    if (!this.isRunning) return

    this.endTime = Date.now()
    this.isRunning = false
    clearInterval(this.timerInterval)

    const finalTime = this.getElapsedTime()
    console.log("[v0] Timer stopped at:", finalTime, "seconds")
    return finalTime
  }

  reset() {
    this.stop()
    this.startTime = null
    this.endTime = null
    this.updateDisplay()
  }

  getElapsedTime() {
    if (!this.startTime) return 0

    const endTime = this.endTime || Date.now()
    return ((endTime - this.startTime) / 1000).toFixed(2)
  }

  updateDisplay() {
    if (!this.timerElement) return

    const elapsed = this.getElapsedTime()
    this.timerElement.textContent = elapsed.padStart(5, "0")

    // Add visual effects based on time
    if (elapsed > 15) {
      this.timerElement.style.color = "var(--warning-red)"
      this.timerElement.style.textShadow = "0 0 10px var(--warning-red)"
    } else if (elapsed > 10) {
      this.timerElement.style.color = "var(--neon-pink)"
      this.timerElement.style.textShadow = "0 0 8px var(--neon-pink)"
    } else {
      this.timerElement.style.color = "var(--neon-green)"
      this.timerElement.style.textShadow = "0 0 8px var(--neon-green)"
    }
  }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.GameTimer = GameTimer
}