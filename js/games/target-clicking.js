// Target Clicking - Click moving code snippets before they disappear
class TargetClicking {
  constructor(container) {
    this.container = container
    this.onComplete = null
    this.onError = null
    this.targetsHit = 0
    this.targetsRequired = 1
    this.activeTargets = []
    this.isActive = false
    this.spawnInterval = null
    this.gameArea = null
    this.score = 0
    this.missed = 0
    this.maxMissed = 300

    // Code snippets for targets
    this.codeTargets = [
      "0x7F",
      "NULL",
      "EOF",
      "404",
      "SSH",
      "TCP",
      "UDP",
      "DNS",
      "API",
      "SQL",
      "XSS",
      "JWT",
      "RSA",
      "AES",
      "MD5",
      "SHA",
      "FTP",
      "HTTP",
      "HTTPS",
      "ROOT",
    ]
  }

  start() {
    this.isActive = true
    this.targetsHit = 0
    this.score = 0
    this.missed = 0
    this.activeTargets = []
    this.render()
    this.startSpawning()
  }

  render() {
    this.container.innerHTML = `
      <div class="target-game">
        <div class="target-header">
          <h3>FIREWALL BREACH PROTOCOL</h3>
          <div class="target-stats">
            <div class="stat">
              <span class="stat-label">Targets:</span>
              <span id="targetCount">${this.targetsHit}</span>/${this.targetsRequired}
            </div>
            <div class="stat">
              <span class="stat-label">Missed:</span>
              <span id="missedCount">${this.missed}</span>/${this.maxMissed}
            </div>
          </div>
        </div>
        
        <div class="target-status" id="targetStatus">
          Scanning for vulnerabilities...
        </div>
        
        <div class="target-area" id="targetArea">
          <div class="crosshair"></div>
        </div>
        
        <div class="target-instructions">
          Click the moving code fragments to exploit vulnerabilities
        </div>
      </div>
    `

    this.gameArea = document.getElementById("targetArea")
    this.statusElement = document.getElementById("targetStatus")
    this.targetCountElement = document.getElementById("targetCount")
    this.missedCountElement = document.getElementById("missedCount")

    // Add click listener to game area for missed clicks
    this.gameArea.addEventListener("click", (e) => this.handleMissedClick(e))
  }

  startSpawning() {
    this.statusElement.textContent = "Vulnerabilities detected! Exploit them quickly!"
    this.statusElement.className = "target-status active"

    // Spawn targets at intervals
    this.spawnInterval = setInterval(() => {
      if (this.isActive && this.activeTargets.length < 4) {
        this.spawnTarget()
      }
    }, 1200) // Spawn every 1.2 seconds

    // Spawn first target immediately
    setTimeout(() => this.spawnTarget(), 500)

    console.log("[v0] Target clicking started")
  }

  spawnTarget() {
    if (!this.isActive) return

    const target = this.createTarget()
    this.activeTargets.push(target)
    this.gameArea.appendChild(target.element)

    // Animate target movement
    this.animateTarget(target)

    // Remove target after timeout
    target.timeout = setTimeout(() => {
      this.removeTarget(target, false) // false = missed
    }, target.lifetime)
  }

  createTarget() {
    const element = document.createElement("div")
    element.className = "code-target"
    element.textContent = this.getRandomCodeTarget()

    // Random starting position and movement
    const startSide = Math.floor(Math.random() * 4) // 0=top, 1=right, 2=bottom, 3=left
    const { startX, startY, endX, endY } = this.getTargetPath(startSide)

    element.style.left = startX + "px"
    element.style.top = startY + "px"

    const target = {
      element,
      startX,
      startY,
      endX,
      endY,
      lifetime: 3000 + Math.random() * 2000, // 3-5 seconds
      speed: 0.5 + Math.random() * 1, // Random speed multiplier
      id: Date.now() + Math.random(),
    }

    // Add click listener
    element.addEventListener("click", (e) => {
      e.stopPropagation()
      this.handleTargetClick(target)
    })

    return target
  }

  getRandomCodeTarget() {
    return this.codeTargets[Math.floor(Math.random() * this.codeTargets.length)]
  }

  getTargetPath(startSide) {
    const areaRect = this.gameArea.getBoundingClientRect()
    const areaWidth = areaRect.width - 60 // Account for target size
    const areaHeight = areaRect.height - 40

    let startX, startY, endX, endY

    switch (startSide) {
      case 0: // Top
        startX = Math.random() * areaWidth
        startY = -40
        endX = Math.random() * areaWidth
        endY = areaHeight + 40
        break
      case 1: // Right
        startX = areaWidth + 60
        startY = Math.random() * areaHeight
        endX = -60
        endY = Math.random() * areaHeight
        break
      case 2: // Bottom
        startX = Math.random() * areaWidth
        startY = areaHeight + 40
        endX = Math.random() * areaWidth
        endY = -40
        break
      case 3: // Left
        startX = -60
        startY = Math.random() * areaHeight
        endX = areaWidth + 60
        endY = Math.random() * areaHeight
        break
    }

    return { startX, startY, endX, endY }
  }

  animateTarget(target) {
    const duration = target.lifetime / target.speed
    const startTime = Date.now()

    const animate = () => {
      if (!this.isActive || !target.element.parentNode) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth movement
      const easeProgress = this.easeInOutQuad(progress)

      const currentX = target.startX + (target.endX - target.startX) * easeProgress
      const currentY = target.startY + (target.endY - target.startY) * easeProgress

      target.element.style.left = currentX + "px"
      target.element.style.top = currentY + "px"

      // Add rotation for visual effect
      target.element.style.transform = `rotate(${progress * 360}deg)`

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  handleTargetClick(target) {
    if (!this.isActive) return

    // Remove target
    this.removeTarget(target, true) // true = hit

    // Update score
    this.targetsHit++
    this.score += 10
    this.targetCountElement.textContent = this.targetsHit

    // Visual feedback
    this.showHitEffect(target.element)

    // Check win condition
    if (this.targetsHit >= this.targetsRequired) {
      this.complete()
    }

    console.log("[v0] Target hit! Score:", this.score, "Targets:", this.targetsHit)
  }

  handleMissedClick(e) {
    if (!this.isActive) return

    // Only count as missed if not clicking on a target
    if (e.target === this.gameArea || e.target.classList.contains("crosshair")) {
      this.showMissEffect(
        e.clientX - this.gameArea.getBoundingClientRect().left,
        e.clientY - this.gameArea.getBoundingClientRect().top,
      )
    }
  }

  removeTarget(target, wasHit) {
    const index = this.activeTargets.indexOf(target)
    if (index > -1) {
      this.activeTargets.splice(index, 1)
    }

    if (target.timeout) {
      clearTimeout(target.timeout)
    }

    if (target.element && target.element.parentNode) {
      target.element.remove()
    }

    // Handle missed targets
    if (!wasHit) {
      this.missed++
      this.missedCountElement.textContent = this.missed

      if (this.missed >= this.maxMissed) {
        this.handleGameOver()
      }
    }
  }

  showHitEffect(element) {
    const rect = element.getBoundingClientRect()
    const gameRect = this.gameArea.getBoundingClientRect()

    const effect = document.createElement("div")
    effect.className = "hit-effect"
    effect.textContent = "+10"
    effect.style.left = rect.left - gameRect.left + "px"
    effect.style.top = rect.top - gameRect.top + "px"

    this.gameArea.appendChild(effect)

    setTimeout(() => effect.remove(), 1000)
  }

  showMissEffect(x, y) {
    const effect = document.createElement("div")
    effect.className = "miss-effect"
    effect.textContent = "MISS"
    effect.style.left = x + "px"
    effect.style.top = y + "px"

    this.gameArea.appendChild(effect)

    setTimeout(() => effect.remove(), 800)
  }

  handleGameOver() {
    this.isActive = false
    this.statusElement.textContent = "Too many missed targets! Firewall breach failed."
    this.statusElement.className = "target-status error"

    // Clear all targets
    this.activeTargets.forEach((target) => this.removeTarget(target, false))

    if (this.onError) {
      setTimeout(() => this.onError(), 2000)
    }
  }

  complete() {
    this.isActive = false
    clearInterval(this.spawnInterval)

    this.statusElement.textContent = "Firewall breached successfully! Access granted."
    this.statusElement.className = "target-status success"

    // Clear remaining targets
    this.activeTargets.forEach((target) => this.removeTarget(target, true))

    setTimeout(() => {
      if (this.onComplete) {
        this.onComplete()
      }
    }, 2000)

    console.log("[v0] Target clicking completed with score:", this.score)
  }

  destroy() {
    this.isActive = false
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval)
    }
    this.activeTargets.forEach((target) => this.removeTarget(target, false))
    if (this.container) {
      this.container.innerHTML = ""
    }
  }
}

// Export for use in other modules
if (typeof window !== "undefined") {
  window.TargetClicking = TargetClicking
}
