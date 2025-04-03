document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.querySelector("#title-input")
  const namesInput = document.querySelector("#names-input")
  const titleOutput = document.querySelector("#list-title")
  const namesOutput = document.querySelector("#names")

  const render = () => {
    const titleValue = titleInput.value.trim()
    const names = namesInput.value.trim().split("\n").filter(value => !!value)

    titleOutput.textContent = titleValue
    const listItems = names.map(name => {
      const li = document.createElement("li")
      li.textContent = name
      return li
    })

    namesOutput.replaceChildren(...listItems)
  }

  // Update page when input is updated
  titleInput.addEventListener("input", render)
  namesInput.addEventListener("input", render)
})