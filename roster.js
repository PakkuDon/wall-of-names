const State = {
  parse: (stateString) => {
    try {
      return JSON.parse(atob(stateString))
    } catch (error) {
      // If JSON parse failed fallback to previous state string structure (used until v1.3.2)
      if (error instanceof SyntaxError) {
        const decoded = atob(stateString)
        const [title, ...names] = decoded.split(";")
        return { title, names }
      }
      // Otherwise return default state object
      return {
        title: "",
        names: [],
      }
    }
  },
  toString: ({ title, names }) => {
    return btoa(JSON.stringify({
      title,
      names,
    }), null, 2)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.querySelector("#title-input")
  const namesInput = document.querySelector("#names-input")
  const dateInput = document.querySelector("#date-input")
  const titleOutput = document.querySelector("#list-title")
  const hostOutput = document.querySelector("#current-host")
  const backupsOutput = document.querySelector("#names")
  const copyButton = document.querySelector("#copy-button")
  const editListButton = document.querySelector("#edit-button")
  const viewListButton = document.querySelector("#view-button")
  const placeholderView = document.querySelector("#placeholder-panel")
  const editView = document.querySelector("#list-config")
  const listView = document.querySelector("#list-view")

  const showListView = () => {
    listView.style.display = "flex"
    editView.style.display = "none"
    editListButton.style.display = "inline-block"
    viewListButton.style.display = "none"
  }

  const showEditView = () => {
    listView.style.display = "none"
    editView.style.display = "block"
    editListButton.style.display = "none"
    viewListButton.style.display = "inline-block"
  }

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
    if (title) {
      titleOutput.textContent = title
    }
    else {
      titleOutput.textContent = "Wall of Names"
    }
    hostOutput.textContent = sortedNames[0]
    const listItems = sortedNames.slice(1).map(name => {
      const li = document.createElement("li")
      li.textContent = name
      return li
    })
    backupsOutput.replaceChildren(...listItems)

    // Set page title
    if (title) {
      document.title = `${title} - Wall of Names`
    }
    else {
      document.title = `Wall of Names`
    }

    // Update URL
    const url = new URL(window.location)
    url.searchParams.set("id", State.toString({ title, names }))
    window.history.pushState({},  "", url)
  }

  // Set date picker to today
  // Don't use toISOString as this excludes the timezone
  const today = new Date()
  dateInput.value = `${today.getFullYear().toString().padStart(4, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

  // Load state from URL if present
  const searchQuery = new URLSearchParams(location.search)
  const id = searchQuery.get("id")
  if (id) {
    // Default to list view if ID present
    showListView()

    // Parse lists and display standup roster
    const state = State.parse(id)
    titleInput.value = state.title
    namesInput.value = state.names.join("\n")

    render()
  } else {
    showEditView()
  }
  // Hide placeholder panel after initial render
  placeholderView.style.display = "none"

  // Update page when input is updated
  titleInput.addEventListener("input", render)
  namesInput.addEventListener("input", render)
  dateInput.addEventListener("input", render)

  // Toggle edit view
  editListButton.addEventListener("click", showEditView)
  viewListButton.addEventListener("click", showListView)

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