// Typing Challenge - Type code strings quickly
class TypingChallenge {
  constructor(container) {
    this.container = container
    this.onComplete = null
    this.onError = null
    this.currentChallenge = 0
    this.totalChallenges = 1
    this.isActive = false
    this.startTime = null

    // Code snippets for typing challenges
    this.codeSnippets = [
      "sudo rm -rf /",
      "SELECT * FROM users;",
      "import sys; sys.exit()",
      "console.log('hacked');",
      "chmod 777 mainframe",
      "ping 192.168.1.1",
      "cat /etc/passwd",
      "netstat -tulpn",
      "ps aux | grep root",
      "curl -X POST api/hack",
      "ssh root@mainframe",
      "nmap -sS target.com",
      "grep -r 'password'",
      "tail -f /var/log/auth",
      "whoami && id",
    ]
  }

  start() {
    this.isActive = true
    this.currentChallenge = 0
    this.startTime = Date.now()
    this.render()
    this.startChallenge()
  }

  render() {
    this.container.innerHTML = `
      <div class="typing-game">
        <div class="typing-header">
          <h3>CODE INJECTION PROTOCOL</h3>
          <div class="challenge-progress">
            <span id="challengeCount">${this.currentChallenge + 1}</span>/${this.totalChallenges}
          </div>
        </div>
        
        <div class="typing-display">
          <div class="code-to-type" id="codeToType"></div>
          <div class="typing-input-container">
            <input type="text" id="typingInput" placeholder="Type the code..." autocomplete="off" autocorrect="off" spellcheck="false">
          </div>
          <div class="typing-feedback" id="typingFeedback"></div>
        </div>
        
        <div class="typing-stats">
          <div class="stat">
            <span class="stat-label">WPM:</span>
            <span id="wpmDisplay">0</span>
          </div>
          <div class="stat">
            <span class="stat-label">Accuracy:</span>
            <span id="accuracyDisplay">100%</span>
          </div>
        </div>
      </div>
    `

    // Get DOM elements
    this.codeDisplay = document.getElementById("codeToType")
    this.typingInput = document.getElementById("typingInput")
    this.feedback = document.getElementById("typingFeedback")
    this.challengeCount = document.getElementById("challengeCount")
    this.wpmDisplay = document.getElementById("wpmDisplay")
    this.accuracyDisplay = document.getElementById("accuracyDisplay")

    // Add event listeners
    this.typingInput.addEventListener("input", (e) => this.handleInput(e))
    this.typingInput.addEventListener("keydown", (e) => this.handleKeydown(e))

    // Focus input
    setTimeout(() => this.typingInput.focus(), 100)
  }

  startChallenge() {
    if (this.currentChallenge >= this.totalChallenges) {
      this.complete()
      return
    }

    // Get random code snippet
    const snippet = this.getRandomSnippet()
    this.currentCode = snippet
    this.typedText = ""
    this.errors = 0

    // Update display
    this.codeDisplay.textContent = snippet
    this.typingInput.value = ""
    this.challengeCount.textContent = this.currentChallenge + 1
    this.feedback.textContent = "Type the code exactly as shown..."

    // Reset input styling
    this.typingInput.className = "typing-input"
    this.typingInput.focus()

    console.log("[v0] Starting typing challenge:", snippet)
  }

  getRandomSnippet() {
    const availableSnippets = this.codeSnippets.filter((snippet) => snippet !== this.currentCode)
    return availableSnippets[Math.floor(Math.random() * availableSnippets.length)]
  }

  handleInput(e) {
    if (!this.isActive) return

    const typed = e.target.value
    this.typedText = typed

    // Check if completed
    if (typed === this.currentCode) {
      this.completeChallenge()
      return
    }

    // Update visual feedback
    this.updateVisualFeedback(typed)
    this.updateStats(typed)
  }

  handleKeydown(e) {
    // Prevent certain keys that might interfere
    if (e.key === "Tab") {
      e.preventDefault()
    }
  }

  updateVisualFeedback(typed) {
    const isCorrect = this.currentCode.startsWith(typed)

    if (isCorrect) {
      this.typingInput.className = "typing-input correct"
      this.feedback.textContent = "Correct... keep going!"
      this.feedback.className = "typing-feedback success"
    } else {
      this.typingInput.className = "typing-input error"
      this.feedback.textContent = "Error detected! Check your input."
      this.feedback.className = "typing-feedback error"
      this.errors++
    }

    // Highlight typed portion in code display
    this.highlightProgress(typed)
  }

  highlightProgress(typed) {
    const code = this.currentCode
    const correctPortion = code.substring(0, typed.length)
    const remainingPortion = code.substring(typed.length)

    const isCorrect = code.startsWith(typed)
    const highlightClass = isCorrect ? "correct" : "error"

    this.codeDisplay.innerHTML = `
      <span class="typed ${highlightClass}">${correctPortion}</span><span class="remaining">${remainingPortion}</span>
    `
  }

  updateStats(typed) {
    // Calculate WPM
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60 // minutes
    const wordsTyped = typed.length / 5 // standard: 5 characters = 1 word
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0

    // Calculate accuracy
    const totalChars = typed.length
    const accuracy = totalChars > 0 ? Math.round(((totalChars - this.errors) / totalChars) * 100) : 100

    this.wpmDisplay.textContent = wpm
    this.accuracyDisplay.textContent = `${accuracy}%`
  }

  completeChallenge() {
    this.currentChallenge++
    this.typingInput.className = "typing-input success"
    this.feedback.textContent = "Code injection successful!"
    this.feedback.className = "typing-feedback success"

    // Brief pause before next challenge
    setTimeout(() => {
      if (this.currentChallenge < this.totalChallenges) {
        this.startChallenge()
      } else {
        this.complete()
      }
    }, 1000)
  }

  complete() {
    this.isActive = false
    this.feedback.textContent = "All code injections completed! Access granted."
    this.feedback.className = "typing-feedback success"

    setTimeout(() => {
      if (this.onComplete) {
        this.onComplete()
      }
    }, 1500)

    console.log("[v0] Typing challenge completed")
  }

  destroy() {
    this.isActive = false
    if (this.container) {
      this.container.innerHTML = ""
    }
  }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.TypingChallenge = TypingChallenge
}
