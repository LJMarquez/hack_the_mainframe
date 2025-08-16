// // Admin Dashboard - Password protected leaderboard management
// class AdminDashboard {
//   constructor() {
//     this.isAuthenticated = false
//     this.refreshInterval = null
//     this.refreshCountdown = null
//     this.countdownValue = 5
//     this.leaderboardData = []

//     // DOM elements
//     this.passwordModal = document.getElementById("passwordModal")
//     this.passwordInput = document.getElementById("devPassword")
//     this.unlockButton = document.getElementById("unlockDev")
//     this.passwordError = document.getElementById("passwordError")
//     this.adminDashboard = document.getElementById("adminDashboard")
//     this.leaderboardTable = document.getElementById("leaderboardTable")
//     this.refreshCountdownElement = document.getElementById("refreshCountdown")

//     this.initializeEventListeners()
//     this.showPasswordModal()
//   }

//   initializeEventListeners() {
//     // Unlock button
//     this.unlockButton.addEventListener("click", () => {
//       this.handleAuthentication()
//     })

//     // Enter key in password input
//     this.passwordInput.addEventListener("keypress", (e) => {
//       if (e.key === "Enter") {
//         this.handleAuthentication()
//       }
//     })

//     // Auto-focus password input
//     this.passwordInput.addEventListener("focus", () => {
//       window.scrollTo(0, 0)
//     })

//     // Handle visibility change (pause refresh when tab is hidden)
//     document.addEventListener("visibilitychange", () => {
//       if (this.isAuthenticated) {
//         if (document.hidden) {
//           this.pauseRefresh()
//         } else {
//           this.resumeRefresh()
//         }
//       }
//     })

//     // Handle page unload
//     window.addEventListener("beforeunload", () => {
//       this.cleanup()
//     })
//   }

//   showPasswordModal() {
//     this.passwordModal.classList.remove("hidden")
//     setTimeout(() => {
//       this.passwordInput.focus()
//     }, 100)
//   }

//   hidePasswordModal() {
//     this.passwordModal.classList.add("hidden")
//   }

//   handleAuthentication() {
//     const enteredPassword = this.passwordInput.value.trim()
//     // const correctPassword = window.CONFIG.ADMIN_PASSWORD
//     const correctPassword = CONFIG.ADMIN_PASSWORD

//     if (enteredPassword === correctPassword) {
//       this.authenticate()
//     } else {
//       this.showPasswordError()
//     }
//   }

//   authenticate() {
//     this.isAuthenticated = true
//     this.hidePasswordModal()
//     this.showAdminDashboard()
//     this.startLeaderboardRefresh()

//     console.log("Admin authenticated successfully")
//   }

//   showPasswordError() {
//     this.passwordError.classList.remove("hidden")
//     this.passwordError.textContent = "Access Denied - Invalid Password"

//     // Shake animation for input
//     this.passwordInput.style.animation = "shake 0.5s ease-in-out"
//     this.passwordInput.value = ""

//     setTimeout(() => {
//       this.passwordInput.style.animation = ""
//       this.passwordError.classList.add("hidden")
//     }, 3000)

//     // Focus back to input
//     this.passwordInput.focus()
//   }

//   showAdminDashboard() {
//     this.adminDashboard.classList.remove("hidden")
//     this.loadLeaderboard()
//   }

//   async loadLeaderboard() {
//     try {
//       this.showLoadingState()

//       // This will use the API integration from the next task
//       if (window.GameAPI) {
//         this.leaderboardData = await window.GameAPI.getLeaderboard()
//       } else {
//         // Fallback with mock data for testing
//         this.leaderboardData = this.getMockLeaderboardData()
//       }

//       this.renderLeaderboard()
//       console.log("Leaderboard loaded:", this.leaderboardData.length, "entries")
//     } catch (error) {
//       console.error("[v0] Error loading leaderboard:", error)
//       this.showErrorState("Failed to load leaderboard data")
//     }
//   }

//   getMockLeaderboardData() {
//     // Mock data for testing when API is not available
//     return [
//       { name: "AGENT_ZERO", time: "12.34", rank: 1 },
//       { name: "CYBER_NINJA", time: "13.67", rank: 2 },
//       { name: "MATRIX_WALKER", time: "14.89", rank: 3 },
//       { name: "CODE_BREAKER", time: "15.23", rank: 4 },
//       { name: "GHOST_SHELL", time: "16.45", rank: 5 },
//     ]
//   }

//   showLoadingState() {
//     this.leaderboardTable.innerHTML = `
//       <div class="loading-state">
//         <div class="loading-spinner"></div>
//         <p>Accessing mainframe database...</p>
//       </div>
//     `
//   }

//   showErrorState(message) {
//     this.leaderboardTable.innerHTML = `
//       <div class="error-state">
//         <p class="error-message">${message}</p>
//         <button onclick="window.adminDashboard.loadLeaderboard()" class="retry-button">
//           RETRY CONNECTION
//         </button>
//       </div>
//     `
//   }

//   renderLeaderboard() {
//     if (!this.leaderboardData || this.leaderboardData.length === 0) {
//       this.leaderboardTable.innerHTML = `
//         <div class="empty-state">
//           <p>No agent data found in the mainframe.</p>
//           <p class="empty-subtitle">Waiting for infiltration attempts...</p>
//         </div>
//       `
//       return
//     }

//     // Create table HTML
//     const tableHTML = `
//       <div class="leaderboard-header">
//         <h3>INFILTRATION RECORDS</h3>
//         <div class="record-count">${this.leaderboardData.length} agents tracked</div>
//       </div>
      
//       <div class="leaderboard-scroll">
//         <table class="leaderboard-table">
//           <thead>
//             <tr>
//               <th>RANK</th>
//               <th>AGENT</th>
//               <th>TIME</th>
//               <th>STATUS</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${this.leaderboardData
//               .map(
//                 (entry, index) => `
//               <tr class="leaderboard-row ${this.getRowClass(index)}">
//                 <td class="rank-cell">
//                   <span class="rank-number">${index + 1}</span>
//                   ${this.getRankIcon(index)}
//                 </td>
//                 <td class="name-cell">
//                   <span class="agent-name">${this.escapeHtml(entry.name)}</span>
//                 </td>
//                 <td class="time-cell">
//                   <span class="time-value">${entry.time}s</span>
//                 </td>
//                 <td class="status-cell">
//                   <span class="status-badge ${this.getStatusClass(entry.time)}">
//                     ${this.getStatusText(entry.time)}
//                   </span>
//                 </td>
//               </tr>
//             `,
//               )
//               .join("")}
//           </tbody>
//         </table>
//       </div>
//     `

//     this.leaderboardTable.innerHTML = tableHTML
//   }

//   getRowClass(index) {
//     if (index === 0) return "first-place"
//     if (index === 1) return "second-place"
//     if (index === 2) return "third-place"
//     return ""
//   }

//   getRankIcon(index) {
//     const icons = ["🥇", "🥈", "🥉"]
//     return index < 3 ? `<span class="rank-icon">${icons[index]}</span>` : ""
//   }

//   getStatusClass(time) {
//     const timeNum = Number.parseFloat(time)
//     if (timeNum < 10) return "elite"
//     if (timeNum < 15) return "skilled"
//     if (timeNum < 20) return "average"
//     return "novice"
//   }

//   getStatusText(time) {
//     const timeNum = Number.parseFloat(time)
//     if (timeNum < 10) return "ELITE"
//     if (timeNum < 15) return "SKILLED"
//     if (timeNum < 20) return "AVERAGE"
//     return "NOVICE"
//   }

//   escapeHtml(text) {
//     const div = document.createElement("div")
//     div.textContent = text
//     return div.innerHTML
//   }

//   startLeaderboardRefresh() {
//     // Initial load
//     this.loadLeaderboard()

//     // Set up auto-refresh
//     this.refreshInterval = setInterval(() => {
//       this.loadLeaderboard()
//     // }, window.CONFIG.GAME_SETTINGS.AUTO_REFRESH_INTERVAL)
//     }, CONFIG.GAME_SETTINGS.AUTO_REFRESH_INTERVAL)

//     // Start countdown timer
//     this.startRefreshCountdown()
//   }

//   startRefreshCountdown() {
//     this.countdownValue = 5
//     this.updateCountdownDisplay()

//     this.refreshCountdown = setInterval(() => {
//       this.countdownValue--
//       this.updateCountdownDisplay()

//       if (this.countdownValue <= 0) {
//         this.countdownValue = 5
//       }
//     }, 1000)
//   }

//   updateCountdownDisplay() {
//     if (this.refreshCountdownElement) {
//       this.refreshCountdownElement.textContent = this.countdownValue
//     }
//   }

//   pauseRefresh() {
//     if (this.refreshInterval) {
//       clearInterval(this.refreshInterval)
//       this.refreshInterval = null
//     }
//     if (this.refreshCountdown) {
//       clearInterval(this.refreshCountdown)
//       this.refreshCountdown = null
//     }
//     console.log("[v0] Admin refresh paused")
//   }

//   resumeRefresh() {
//     if (!this.refreshInterval && this.isAuthenticated) {
//       this.startLeaderboardRefresh()
//       console.log("[v0] Admin refresh resumed")
//     }
//   }

//   cleanup() {
//     this.pauseRefresh()
//   }

//   // Manual refresh function
//   manualRefresh() {
//     this.loadLeaderboard()
//     this.countdownValue = 5
//     console.log("[v0] Manual leaderboard refresh triggered")
//   }

//   // Export leaderboard data (bonus feature)
//   exportLeaderboard() {
//     if (!this.leaderboardData || this.leaderboardData.length === 0) {
//       alert("No data to export")
//       return
//     }

//     const csvContent = [
//       "Rank,Agent Name,Time (seconds),Status",
//       ...this.leaderboardData.map(
//         (entry, index) => `${index + 1},"${entry.name}",${entry.time},${this.getStatusText(entry.time)}`,
//       ),
//     ].join("\n")

//     const blob = new Blob([csvContent], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `mainframe-leaderboard-${new Date().toISOString().split("T")[0]}.csv`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     window.URL.revokeObjectURL(url)

//     console.log("[v0] Leaderboard exported to CSV")
//   }
// }

// // Initialize admin dashboard when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("[v0] Initializing Admin Dashboard")
//   window.adminDashboard = new AdminDashboard()
// })

// // Export for use in other modules
// if (typeof window !== "undefined") {
//   window.AdminDashboard = AdminDashboard
// }


// Admin Dashboard - Password protected leaderboard management
class AdminDashboard {
  constructor() {
    this.isAuthenticated = false
    this.refreshInterval = null
    this.refreshCountdown = null
    this.countdownValue = 5
    this.leaderboardData = []
    this.lastDataHash = null
    this.notificationQueue = []
    this.isShowingNotification = false

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

    console.log("[v0] Admin authenticated successfully")
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
        const newData = await window.GameAPI.getLeaderboard()
        this.leaderboardData = this.sortLeaderboardData(newData)
        this.detectChangesAndNotify(newData)
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

  sortLeaderboardData(data) {
    if (!Array.isArray(data)) return []

    return data.sort((a, b) => {
      const timeA = Number.parseFloat(a.time) || Number.MAX_VALUE
      const timeB = Number.parseFloat(b.time) || Number.MAX_VALUE
      return timeA - timeB
    })
  }

  detectChangesAndNotify(newData) {
    const newDataHash = this.generateDataHash(newData)

    if (this.lastDataHash && this.lastDataHash !== newDataHash) {
      // Data has changed, check for new winners
      this.checkForNewWinners(newData)
    }

    this.lastDataHash = newDataHash
  }

  generateDataHash(data) {
    if (!Array.isArray(data) || data.length === 0) return "empty"

    // Create hash based on sorted data to detect any changes
    const sortedData = this.sortLeaderboardData(data)
    return JSON.stringify(sortedData.map((entry) => ({ name: entry.name, time: entry.time })))
  }

  checkForNewWinners(newData) {
    const sortedData = this.sortLeaderboardData(newData)

    // Check if we have previous data to compare against
    if (this.leaderboardData.length === 0) return

    const previousBestTime =
      this.leaderboardData.length > 0 ? Number.parseFloat(this.leaderboardData[0].time) : Number.MAX_VALUE

    // Find new entries that are better than or equal to previous best
    const newWinners = sortedData.filter((entry) => {
      const entryTime = Number.parseFloat(entry.time)
      const wasInPreviousData = this.leaderboardData.some(
        (prev) => prev.name === entry.name && Number.parseFloat(prev.time) === entryTime,
      )

      return !wasInPreviousData && entryTime <= previousBestTime + 1 // Allow 1 second tolerance for "winners"
    })

    // Queue notifications for new winners
    newWinners.forEach((winner) => {
      this.queueNotification({
        type: "winner",
        name: winner.name,
        time: winner.time,
        timestamp: Date.now(),
      })
    })
  }

  queueNotification(notification) {
    this.notificationQueue.push(notification)
    this.processNotificationQueue()
  }

  async processNotificationQueue() {
    if (this.isShowingNotification || this.notificationQueue.length === 0) return

    this.isShowingNotification = true
    const notification = this.notificationQueue.shift()

    await this.showNotification(notification)

    this.isShowingNotification = false

    // Process next notification if any
    if (this.notificationQueue.length > 0) {
      setTimeout(() => this.processNotificationQueue(), 500)
    }
  }

  async showNotification(notification) {
    return new Promise((resolve) => {
      // Create notification element
      const notificationEl = document.createElement("div")
      notificationEl.className = "winner-notification"
      notificationEl.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">🎯</div>
          <div class="notification-text">
            <strong>${this.escapeHtml(notification.name)}</strong> infiltrated the mainframe!
            <div class="notification-time">Time: ${notification.time}s</div>
          </div>
          <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `

      // Add to page
      document.body.appendChild(notificationEl)

      // Animate in
      setTimeout(() => notificationEl.classList.add("show"), 100)

      // Auto-remove after 5 seconds
      setTimeout(() => {
        notificationEl.classList.remove("show")
        setTimeout(() => {
          if (notificationEl.parentElement) {
            notificationEl.remove()
          }
          resolve()
        }, 300)
      }, 5000)
    })
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

    // Set up smart refresh - more frequent checks but only full reload when needed
    this.refreshInterval = setInterval(() => {
      this.loadLeaderboard()
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
