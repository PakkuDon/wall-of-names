document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.querySelector("#title-input")
  const namesInput = document.querySelector("#names-input")
  const dateInput = document.querySelector("#date-input")
  const titleOutput = document.querySelector("#list-title")
  const hostOutput = document.querySelector("#current-host")
  const backupsOutput = document.querySelector("#names")

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
    const dX = i % 2 === 0 ? 1 : -1
    const dY = i % 2 === 0 ? 1 : -1
    sharks.push({
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
      dX: dX * (Math.floor(Math.random() * 20) + 20),
      dY: dY * (Math.floor(Math.random() * 20) + 20),
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
  let lastTick = new Date().getTime()
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
          shark.dX = -shark.dX
          shark.x = window.innerWidth
        }
        if (shark.y < 0) {
          shark.dY = Math.abs(shark.dY)
          shark.y = 0
        }
        if (shark.y >= window.innerHeight) {
          shark.dY = -shark.dY
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
})