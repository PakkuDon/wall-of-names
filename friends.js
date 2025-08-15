// Note: This app previously featured a whole bunch of sharks floating around
// The sharks can now be swapped out with other emojis. I wasn't sure what to
// call these objects so I've started referring to them as 'friends'

document.addEventListener("DOMContentLoaded", () => {
  const spawnButton = document.querySelector("#spawn-button")
  const friendCounter = document.querySelector("#friend-counter")

  // Initialise friend x,y and velocity values
  const friends = []
  const initialSpawnCount = Math.floor(Math.random() * 5) + 10
  for (let i = 0; i < initialSpawnCount; i++) {
    friends.push({
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
      dX: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
      dY: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
    })
  }

  // Add friends to page
  friends.forEach(friend => {
    const elem = document.createElement("div")
    elem.className = "friend text-2xl"
    elem.style.top = `${friend.y}px`
    elem.style.left = `${friend.x}px`
    elem.style.animationDuration = `${Math.floor((Math.random() * 5) + 1)}s`

    document.body.appendChild(elem)
    friend.elem = elem
  })

  // Move friends around
  let lastTick = 0
  const moveFriends = () => {
    const now = new Date().getTime()
    if (now - lastTick > 500) {
      friends.forEach(friend => {
        // If out of bounds flip direction and reset friend coordinates to boundary
        if (friend.x < 0) {
          friend.dX = Math.abs(friend.dX)
          friend.x = 0
        }
        if (friend.x >= window.innerWidth) {
          friend.dX = -Math.abs(friend.dX)
          friend.x = window.innerWidth
        }
        if (friend.y < 0) {
          friend.dY = Math.abs(friend.dY)
          friend.y = 0
        }
        if (friend.y >= window.innerHeight) {
          friend.dY = -Math.abs(friend.dY)
          friend.y = window.innerHeight
        }
  
        friend.x += friend.dX
        friend.y += friend.dY
        friend.elem.style.top = `${friend.y}px`
        friend.elem.style.left = `${friend.x}px`
  
      })

      lastTick = now
    }

    requestAnimationFrame(moveFriends)
  }

  requestAnimationFrame(moveFriends)

  let spawnButtonHeld = false
  let lastSpawn = Date.now()
  let clickX = 0
  let clickY = 0
  const availableSizes = ["md", "lg", "xl", "2xl", "3xl"]
  const spawnFriend = () => {
    // Spawn friends as long as button is held
    // Apply few ms buffer between spawns
    if (spawnButtonHeld && (Date.now() - lastSpawn) > 20) {
      lastSpawn = Date.now()
      // Fallback to random value if mouse event has 0 x / y coordinate
      // This can occur if click event is triggered by keyboard
      const x = clickX || Math.floor(Math.random() * window.innerWidth)
      const y = clickY || Math.floor(Math.random() * window.innerHeight)
      const size = availableSizes[Math.floor(Math.random() * availableSizes.length)]
      const friend = {
        x,
        y,
        dX: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
        dY: (Math.floor(Math.random() * 50) + 10) * (Math.random() > 0.5 ? 1 : -1),
      }

      const elem = document.createElement("div")
      elem.className = `friend text-${size}`
      elem.style.top = `${friend.y}px`
      elem.style.left = `${friend.x}px`
      elem.style.animationDuration = `${Math.floor((Math.random() * 5) + 1)}s`

      friend.elem = elem
      friends.push(friend)
      document.body.appendChild(elem)
    }
    friendCounter.textContent = `${friends.length} friends`

    requestAnimationFrame(spawnFriend)
  }
  // Start spawn loop
  requestAnimationFrame(spawnFriend)

  // Keep spawning friends as long as button is held
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

  // Stop spawning friends when button released
  spawnButton.addEventListener("mouseup", () => { spawnButtonHeld = false })
  spawnButton.addEventListener("keyup", () => { spawnButtonHeld = false })
  spawnButton.addEventListener("touchend", () => { spawnButtonHeld = false })
})

// Change emoji when new emoji selected
document.querySelector('emoji-picker')
  .addEventListener('emoji-click', (event) => {
    document.body.style.setProperty("--selectedFriend", `"${event.detail.unicode}"`)
  })