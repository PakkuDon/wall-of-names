document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.querySelector("#title-input")
  const namesInput = document.querySelector("#names-input")
  const titleOutput = document.querySelector("#list-title")
  const namesOutput = document.querySelector("#names")

  const render = () => {
    const title = titleInput.value.trim()
    const names = namesInput.value.trim().split("\n").filter(value => !!value)

    // Render input in list view
    titleOutput.textContent = title
    const listItems = names.map(name => {
      const li = document.createElement("li")
      li.textContent = name
      return li
    })
    namesOutput.replaceChildren(...listItems)

    // Update URL
    const url = new URL(window.location)
    const encoded = btoa([title, ...names].join(";"))
    url.searchParams.set("id", encoded)
    window.history.pushState({},  "", url)
  }

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
})