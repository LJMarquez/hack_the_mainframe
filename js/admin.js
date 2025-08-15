// Admin Dashboard - Password protected leaderboard management
class AdminDashboard {
  constructor() {
    this.isAuthenticated = false
    this.refreshInterval = null
    this.refreshCountdown = null
    this.countdownValue = 5
    this.leaderboardData = []

    // DOM elements
    this.passwordModal = document.getElementById("passwordModal")
    this.passwordInput = document.getElementById("devPassword")
    this.unlockButton = document.getElementById("unlockDev")
    this.passwordError = document.getElementById("passwordError")
    this.adminDashboard = document.getElementById("adminDashboard")
    this.leaderboardTable = document.getElementById("leaderboardTable")
    this.refreshCountdownElement = document.getElementById("refreshCountdown")

    this.initializeEventListeners()
    this.showPasswordModal()
  }

  initializeEventListeners() {
    // Unlock button
    this.unlockButton.addEventListener("click", () => {
      this.handleAuthentication()
    })

    // Enter key in password input
    this.passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAuthentication()
      }
    })

    // Auto-focus password input
    this.passwordInput.addEventListener("focus", () => {
      window.scrollTo(0, 0)
    })

    // Handle visibility change (pause refresh when tab is hidden)
    document.addEventListener("visibilitychange", () => {
      if (this.isAuthenticated) {
        if (document.hidden) {
          this.pauseRefresh()
        } else {
          this.resumeRefresh()
        }
      }
    })

    // Handle page unload
    window.addEventListener("beforeunload", () => {
      this.cleanup()
    })
  }

  showPasswordModal() {
    this.passwordModal.classList.remove("hidden")
    setTimeout(() => {
      this.passwordInput.focus()
    }, 100)
  }

  hidePasswordModal() {
    this.passwordModal.classList.add("hidden")
  }

  handleAuthentication() {
    const enteredPassword = this.passwordInput.value.trim()
    // const correctPassword = window.CONFIG.ADMIN_PASSWORD
    const correctPassword = CONFIG.ADMIN_PASSWORD

    if (enteredPassword === correctPassword) {
      this.authenticate()
    } else {
      this.showPasswordError()
    }
  }

  authenticate() {
    this.isAuthenticated = true
    this.hidePasswordModal()
    this.showAdminDashboard()
    this.startLeaderboardRefresh()

    console.log("Admin authenticated successfully")
  }

  showPasswordError() {
    this.passwordError.classList.remove("hidden")
    this.passwordError.textContent = "Access Denied - Invalid Password"

    // Shake animation for input
    this.passwordInput.style.animation = "shake 0.5s ease-in-out"
    this.passwordInput.value = ""

    setTimeout(() => {
      this.passwordInput.style.animation = ""
      this.passwordError.classList.add("hidden")
    }, 3000)

    // Focus back to input
    this.passwordInput.focus()
  }

  showAdminDashboard() {
    this.adminDashboard.classList.remove("hidden")
    this.loadLeaderboard()
  }

  async loadLeaderboard() {
    try {
      this.showLoadingState()

      // This will use the API integration from the next task
      if (window.GameAPI) {
        this.leaderboardData = await window.GameAPI.getLeaderboard()
      } else {
        // Fallback with mock data for testing
        this.leaderboardData = this.getMockLeaderboardData()
      }

      this.renderLeaderboard()
      console.log("[v0] Leaderboard loaded:", this.leaderboardData.length, "entries")
    } catch (error) {
      console.error("[v0] Error loading leaderboard:", error)
      this.showErrorState("Failed to load leaderboard data")
    }
  }

  getMockLeaderboardData() {
    // Mock data for testing when API is not available
    return [
      { name: "AGENT_ZERO", time: "12.34", rank: 1 },
      { name: "CYBER_NINJA", time: "13.67", rank: 2 },
      { name: "MATRIX_WALKER", time: "14.89", rank: 3 },
      { name: "CODE_BREAKER", time: "15.23", rank: 4 },
      { name: "GHOST_SHELL", time: "16.45", rank: 5 },
    ]
  }

  showLoadingState() {
    this.leaderboardTable.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Accessing mainframe database...</p>
      </div>
    `
  }

  showErrorState(message) {
    this.leaderboardTable.innerHTML = `
      <div class="error-state">
        <p class="error-message">${message}</p>
        <button onclick="window.adminDashboard.loadLeaderboard()" class="retry-button">
          RETRY CONNECTION
        </button>
      </div>
    `
  }

  renderLeaderboard() {
    if (!this.leaderboardData || this.leaderboardData.length === 0) {
      this.leaderboardTable.innerHTML = `
        <div class="empty-state">
          <p>No agent data found in the mainframe.</p>
          <p class="empty-subtitle">Waiting for infiltration attempts...</p>
        </div>
      `
      return
    }

    // Create table HTML
    const tableHTML = `
      <div class="leaderboard-header">
        <h3>INFILTRATION RECORDS</h3>
        <div class="record-count">${this.leaderboardData.length} agents tracked</div>
      </div>
      
      <div class="leaderboard-scroll">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>AGENT</th>
              <th>TIME</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${this.leaderboardData
              .map(
                (entry, index) => `
              <tr class="leaderboard-row ${this.getRowClass(index)}">
                <td class="rank-cell">
                  <span class="rank-number">${index + 1}</span>
                  ${this.getRankIcon(index)}
                </td>
                <td class="name-cell">
                  <span class="agent-name">${this.escapeHtml(entry.name)}</span>
                </td>
                <td class="time-cell">
                  <span class="time-value">${entry.time}s</span>
                </td>
                <td class="status-cell">
                  <span class="status-badge ${this.getStatusClass(entry.time)}">
                    ${this.getStatusText(entry.time)}
                  </span>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `

    this.leaderboardTable.innerHTML = tableHTML
  }

  getRowClass(index) {
    if (index === 0) return "first-place"
    if (index === 1) return "second-place"
    if (index === 2) return "third-place"
    return ""
  }

  getRankIcon(index) {
    const icons = ["🥇", "🥈", "🥉"]
    return index < 3 ? `<span class="rank-icon">${icons[index]}</span>` : ""
  }

  getStatusClass(time) {
    const timeNum = Number.parseFloat(time)
    if (timeNum < 10) return "elite"
    if (timeNum < 15) return "skilled"
    if (timeNum < 20) return "average"
    return "novice"
  }

  getStatusText(time) {
    const timeNum = Number.parseFloat(time)
    if (timeNum < 10) return "ELITE"
    if (timeNum < 15) return "SKILLED"
    if (timeNum < 20) return "AVERAGE"
    return "NOVICE"
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  startLeaderboardRefresh() {
    // Initial load
    this.loadLeaderboard()

    // Set up auto-refresh
    this.refreshInterval = setInterval(() => {
      this.loadLeaderboard()
    // }, window.CONFIG.GAME_SETTINGS.AUTO_REFRESH_INTERVAL)
    }, CONFIG.GAME_SETTINGS.AUTO_REFRESH_INTERVAL)

    // Start countdown timer
    this.startRefreshCountdown()
  }

  startRefreshCountdown() {
    this.countdownValue = 5
    this.updateCountdownDisplay()

    this.refreshCountdown = setInterval(() => {
      this.countdownValue--
      this.updateCountdownDisplay()

      if (this.countdownValue <= 0) {
        this.countdownValue = 5
      }
    }, 1000)
  }

  updateCountdownDisplay() {
    if (this.refreshCountdownElement) {
      this.refreshCountdownElement.textContent = this.countdownValue
    }
  }

  pauseRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
    if (this.refreshCountdown) {
      clearInterval(this.refreshCountdown)
      this.refreshCountdown = null
    }
    console.log("[v0] Admin refresh paused")
  }

  resumeRefresh() {
    if (!this.refreshInterval && this.isAuthenticated) {
      this.startLeaderboardRefresh()
      console.log("[v0] Admin refresh resumed")
    }
  }

  cleanup() {
    this.pauseRefresh()
  }

  // Manual refresh function
  manualRefresh() {
    this.loadLeaderboard()
    this.countdownValue = 5
    console.log("[v0] Manual leaderboard refresh triggered")
  }

  // Export leaderboard data (bonus feature)
  exportLeaderboard() {
    if (!this.leaderboardData || this.leaderboardData.length === 0) {
      alert("No data to export")
      return
    }

    const csvContent = [
      "Rank,Agent Name,Time (seconds),Status",
      ...this.leaderboardData.map(
        (entry, index) => `${index + 1},"${entry.name}",${entry.time},${this.getStatusText(entry.time)}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mainframe-leaderboard-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    console.log("[v0] Leaderboard exported to CSV")
  }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Initializing Admin Dashboard")
  window.adminDashboard = new AdminDashboard()
})

// Export for use in other modules
if (typeof window !== "undefined") {
  window.AdminDashboard = AdminDashboard
}
