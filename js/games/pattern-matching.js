// Pattern Matching - Repeat sequences of flashing nodes
class PatternMatching {
  constructor(container) {
    this.container = container
    this.onComplete = null
    this.onError = null
    this.currentRound = 0
    this.totalRounds = 1
    this.sequence = []
    this.playerSequence = []
    this.isShowingPattern = false
    this.isPlayerTurn = false
    this.isActive = false
    this.sequenceSpeed = 800 // ms between flashes
  }

  start() {
    this.isActive = true
    this.currentRound = 0
    this.render()
    this.startRound()
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-game">
        <div class="pattern-header">
          <h3>NEURAL PATTERN ANALYSIS</h3>
          <div class="round-progress">
            Round <span id="roundCount">${this.currentRound + 1}</span>/${this.totalRounds}
          </div>
        </div>
        
        <div class="pattern-status" id="patternStatus">
          Analyzing neural pathways...
        </div>
        
        <div class="pattern-grid" id="patternGrid">
          ${this.createGridHTML()}
        </div>
        
        <div class="pattern-instructions">
          Watch the sequence, then repeat it by clicking the nodes
        </div>
      </div>
    `

    this.statusElement = document.getElementById("patternStatus")
    this.roundCountElement = document.getElementById("roundCount")
    this.gridElement = document.getElementById("patternGrid")

    // Add click listeners to nodes
    this.addNodeListeners()
  }

  createGridHTML() {
    let html = ""
    for (let i = 0; i < 9; i++) {
      html += `<div class="pattern-node" data-index="${i}"></div>`
    }
    return html
  }

  addNodeListeners() {
    const nodes = this.gridElement.querySelectorAll(".pattern-node")
    nodes.forEach((node, index) => {
      node.addEventListener("click", () => this.handleNodeClick(index))
      // Add touch support
      node.addEventListener("touchstart", (e) => {
        e.preventDefault()
        this.handleNodeClick(index)
      })
    })
  }

  startRound() {
    if (this.currentRound >= this.totalRounds) {
      this.complete()
      return
    }

    this.sequence = this.generateSequence(this.currentRound + 3) // Start with 3, increase each round
    this.playerSequence = []
    this.roundCountElement.textContent = this.currentRound + 1

    this.statusElement.textContent = "Memorize the pattern..."
    this.statusElement.className = "pattern-status analyzing"

    // Show the pattern after a brief delay
    setTimeout(() => {
      this.showPattern()
    }, 1000)

    console.log("[v0] Pattern round", this.currentRound + 1, "sequence:", this.sequence)
  }

  generateSequence(length) {
    const sequence = []
    for (let i = 0; i < length; i++) {
      let nextNode
      do {
        nextNode = Math.floor(Math.random() * 9)
      } while (sequence.length > 0 && nextNode === sequence[sequence.length - 1]) // Avoid consecutive repeats
      sequence.push(nextNode)
    }
    return sequence
  }

  async showPattern() {
    this.isShowingPattern = true
    this.isPlayerTurn = false

    for (let i = 0; i < this.sequence.length; i++) {
      const nodeIndex = this.sequence[i]
      await this.flashNode(nodeIndex)
      await this.delay(this.sequenceSpeed)
    }

    this.isShowingPattern = false
    this.isPlayerTurn = true
    this.statusElement.textContent = "Repeat the pattern by clicking the nodes"
    this.statusElement.className = "pattern-status player-turn"
  }

  async flashNode(index) {
    const nodes = this.gridElement.querySelectorAll(".pattern-node")
    const node = nodes[index]

    node.classList.add("active")
    await this.delay(400)
    node.classList.remove("active")
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  handleNodeClick(index) {
    if (!this.isActive || !this.isPlayerTurn || this.isShowingPattern) return

    const nodes = this.gridElement.querySelectorAll(".pattern-node")
    const node = nodes[index]

    // Visual feedback
    node.classList.add("clicked")
    setTimeout(() => node.classList.remove("clicked"), 200)

    // Add to player sequence
    this.playerSequence.push(index)

    // Check if correct so far
    const currentStep = this.playerSequence.length - 1
    if (this.playerSequence[currentStep] !== this.sequence[currentStep]) {
      this.handleError()
      return
    }

    // Check if sequence is complete
    if (this.playerSequence.length === this.sequence.length) {
      this.completeRound()
    }

    console.log(
      "[v0] Player clicked node:",
      index,
      "Sequence progress:",
      this.playerSequence.length,
      "/",
      this.sequence.length,
    )
  }

  handleError() {
    this.statusElement.textContent = "Pattern mismatch! Retrying..."
    this.statusElement.className = "pattern-status error"

    // Flash all nodes red
    const nodes = this.gridElement.querySelectorAll(".pattern-node")
    nodes.forEach((node) => node.classList.add("error"))

    setTimeout(() => {
      nodes.forEach((node) => node.classList.remove("error"))
      // Retry the same round
      this.playerSequence = []
      setTimeout(() => this.showPattern(), 1000)
    }, 1000)
  }

  completeRound() {
    this.currentRound++
    this.statusElement.textContent = "Pattern recognized! Advancing..."
    this.statusElement.className = "pattern-status success"

    // Flash all nodes green
    const nodes = this.gridElement.querySelectorAll(".pattern-node")
    nodes.forEach((node) => node.classList.add("success"))

    setTimeout(() => {
      nodes.forEach((node) => node.classList.remove("success"))
      if (this.currentRound < this.totalRounds) {
        // Increase difficulty (faster sequence)
        this.sequenceSpeed = Math.max(400, this.sequenceSpeed - 100)
        this.startRound()
      } else {
        this.complete()
      }
    }, 1500)
  }

  complete() {
    this.isActive = false
    this.statusElement.textContent = "Neural pattern analysis complete! Access granted."
    this.statusElement.className = "pattern-status success"

    setTimeout(() => {
      if (this.onComplete) {
        this.onComplete()
      }
    }, 2000)

    console.log("[v0] Pattern matching completed")
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
  window.PatternMatching = PatternMatching
}