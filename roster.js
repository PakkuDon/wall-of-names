document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.querySelector("#title-input")
  const namesInput = document.querySelector("#names-input")
  const dateInput = document.querySelector("#date-input")
  const titleOutput = document.querySelector("#list-title")
  const hostOutput = document.querySelector("#current-host")
  const backupsOutput = document.querySelector("#names")
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
  // Don't use toISOString as this excludes the timezone
  const today = new Date()
  dateInput.value = `${today.getFullYear().toString().padStart(4, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

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