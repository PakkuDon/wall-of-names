document.addEventListener("DOMContentLoaded", () => {
  const spawnButton = document.querySelector("#shark-button")
  const sharkCounter = document.querySelector("#shark-counter")

  // Initialise shark x,y and velocity values
  const sharks = []
  const sharksToSpawn = Math.floor(Math.random() * 5) + 10
  for (let i = 0; i < sharksToSpawn; i++) {
    sharks.push({
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
      dX: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
      dY: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
    })
  }

  // Add sharks to page
  sharks.forEach(shark => {
    const elem = document.createElement("div")
    elem.className = "shark text-2xl"
    elem.style.top = `${shark.y}px`
    elem.style.left = `${shark.x}px`
    elem.style.animationDuration = `${Math.floor((Math.random() * 5) + 1)}s`

    document.body.appendChild(elem)
    shark.elem = elem
  })

  // Move sharks around
  let lastTick = 0
  const moveSharks = () => {
    const now = new Date().getTime()
    if (now - lastTick > 500) {
      sharks.forEach(shark => {
        // If out of bounds flip direction and reset shark coordinates to boundary
        if (shark.x < 0) {
          shark.dX = Math.abs(shark.dX)
          shark.x = 0
        }
        if (shark.x >= window.innerWidth) {
          shark.dX = -Math.abs(shark.dX)
          shark.x = window.innerWidth
        }
        if (shark.y < 0) {
          shark.dY = Math.abs(shark.dY)
          shark.y = 0
        }
        if (shark.y >= window.innerHeight) {
          shark.dY = -Math.abs(shark.dY)
          shark.y = window.innerHeight
        }
  
        shark.x += shark.dX
        shark.y += shark.dY
        shark.elem.style.top = `${shark.y}px`
        shark.elem.style.left = `${shark.x}px`
  
      })

      lastTick = now
    }

    requestAnimationFrame(moveSharks)
  }

  requestAnimationFrame(moveSharks)

  let spawnButtonHeld = false
  let lastSpawn = Date.now()
  let clickX = 0
  let clickY = 0
  const availableSizes = ["md", "lg", "xl", "2xl", "3xl"]
  const spawnShark = () => {
    // Spawn sharks as long as button is held
    // Apply few ms buffer between spawns
    if (spawnButtonHeld && (Date.now() - lastSpawn) > 20) {
      lastSpawn = Date.now()
      // Fallback to random value if mouse event has 0 x / y coordinate
      // This can occur if click event is triggered by keyboard
      const x = clickX || Math.floor(Math.random() * window.innerWidth)
      const y = clickY || Math.floor(Math.random() * window.innerHeight)
      const size = availableSizes[Math.floor(Math.random() * availableSizes.length)]
      const shark = {
        x,
        y,
        dX: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
        dY: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
      }

      const elem = document.createElement("div")
      elem.className = `shark text-${size}`
      elem.style.top = `${shark.y}px`
      elem.style.left = `${shark.x}px`
      elem.style.animationDuration = `${Math.floor((Math.random() * 5) + 1)}s`

      shark.elem = elem
      sharks.push(shark)
      document.body.appendChild(elem)
    }
    sharkCounter.textContent = `${sharks.length} sharks`

    requestAnimationFrame(spawnShark)
  }
  // Start spawn loop
  requestAnimationFrame(spawnShark)

  // Keep spawning sharks as long as button is held
  spawnButton.addEventListener("mousedown", (event) => {
    clickX = event.clientX
    clickY = event.clientY
    spawnButtonHeld = true
  })
  spawnButton.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      const { width, height, top, left } = event.target.getBoundingClientRect()
      clickX = Math.floor(left + Math.random() * width)
      clickY = Math.floor(top + Math.random() * height)
      spawnButtonHeld = true
    }
  })
  spawnButton.addEventListener("touchstart", (event) => {
    const touch = event.touches[0]
    if (touch) {
      clickX = touch.clientX
      clickY = touch.clientY
      spawnButtonHeld = true
    }
  })
  spawnButton.addEventListener("touchmove", (event) => {
    const touch = event.touches[0]
    if (touch) {
      clickX = touch.clientX
      clickY = touch.clientY
    }
  })

  // Stop spawning sharks when button released
  spawnButton.addEventListener("mouseup", () => { spawnButtonHeld = false })
  spawnButton.addEventListener("keyup", () => { spawnButtonHeld = false })
  spawnButton.addEventListener("touchend", () => { spawnButtonHeld = false })
})
