document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.querySelector("#title-input")
  const namesInput = document.querySelector("#names-input")
  const dateInput = document.querySelector("#date-input")
  const titleOutput = document.querySelector("#list-title")
  const hostOutput = document.querySelector("#current-host")
  const backupsOutput = document.querySelector("#names")
  const spawnButton = document.querySelector("#shark-button")
  const copyButton = document.querySelector("#copy-button")

  const render = () => {
    const title = titleInput.value.trim()
    const names = namesInput.value.trim().split("\n").filter(value => !!value)
    const date = new Date(dateInput.value)

    // Shuffle names by current date % list length to get today's list order
    // This ensures a new host is selected each day and that the list order stays consistent
    const daysSinceEpoch = Math.floor(date / (1000 * 60 * 60 * 24))
    const sortedNames = [...names]
    if (sortedNames.length > 0) {
      for (let i = 0; i < daysSinceEpoch % names.length; i++) {
        sortedNames.push(sortedNames.shift())
      }
    }

    // Render input in list view
    titleOutput.textContent = title
    hostOutput.textContent = sortedNames[0]
    const listItems = sortedNames.slice(1).map(name => {
      const li = document.createElement("li")
      li.textContent = name
      return li
    })
    backupsOutput.replaceChildren(...listItems)

    // Update URL
    const url = new URL(window.location)
    const encoded = btoa([title, ...names].join(";"))
    url.searchParams.set("id", encoded)
    window.history.pushState({},  "", url)
  }

  // Set date picker to today
  dateInput.valueAsDate = new Date()

  // Load state from URL if present
  const searchQuery = new URLSearchParams(location.search)
  const id = searchQuery.get("id")
  if (id) {
    const decoded = atob(id)
    const [title, ...names] = decoded.split(";")
    titleInput.value = title
    namesInput.value = names.join("\n")

    render()
  }

  // Update page when input is updated
  titleInput.addEventListener("input", render)
  namesInput.addEventListener("input", render)
  dateInput.addEventListener("input", render)

  // Sharks for decoration
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
  const spawnShark = () => {
    // Spawn sharks as long as button is held
    // Apply few ms buffer between spawns
    if (spawnButtonHeld && (Date.now() - lastSpawn) > 20) {
      lastSpawn = Date.now()
      // Fallback to random value if mouse event has 0 x / y coordinate
      // This can occur if click event is triggered by keyboard
      const x = clickX || Math.floor(Math.random() * window.innerWidth)
      const y = clickY || Math.floor(Math.random() * window.innerHeight)
      const shark = {
        x,
        y,
        dX: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
        dY: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
      }

      const elem = document.createElement("div")
      elem.className = "shark text-2xl"
      elem.style.top = `${shark.y}px`
      elem.style.left = `${shark.x}px`
      elem.style.animationDuration = `${Math.floor((Math.random() * 5) + 1)}s`

      shark.elem = elem
      sharks.push(shark)
      document.body.appendChild(elem)
    }

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
      clickX = 0
      clickY = 0
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

  // Copy list URL to clipboard
  const defaultCopyButtonText = copyButton.textContent
  let confirmationMessageTimeoutId
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(location.href)
      .then(() => {
        // Display confirmation message for copy
        copyButton.textContent = "Copied! ✅"
        clearTimeout(confirmationMessageTimeoutId)
        confirmationMessageTimeoutId = setTimeout(() => {
          copyButton.textContent = defaultCopyButtonText
        }, 1000)
      })
  })
})