const { contextBridge, ipcRenderer, session } = require('electron')

contextBridge.exposeInMainWorld('todos', {
    registerTodo: (data) => ipcRenderer.invoke('registerTodo', data),
    deleteTodo: (id) => ipcRenderer.invoke('deleteTodo', id),
    updateTodo: (id, data) => ipcRenderer.invoke('updateTodo', id, data),
    refreshTodos: (type) => {
        sessionStorage.setItem("filter", type)
        ipcRenderer.invoke('refreshTodos')
    },
    filterTodos: (value) => {
        ipcRenderer.invoke('filterTodos', value)
    }
})

// Update todos in DOM
ipcRenderer.on("todos", (event, todos) => {
    const filter = sessionStorage.getItem("filter") || "unsolved"
    todos = Object.fromEntries(Object.entries(todos).filter(([id, todo]) => todo.solved == (filter == "solved" ? true : false)))

    const tbody = document.querySelector("tbody")

    // Clear table
    tbody.querySelectorAll("tr").forEach(tr => tr.remove())

    // Add todos to table
    Object.entries(todos).forEach(([id, todo]) => {
        const tr = document.createElement("tr")
        tr.setAttribute("id", id)

        const { createdTimestamp, solved } = todo

        delete todo.createdTimestamp
        delete todo.solved

        const createdDate = new Date(createdTimestamp).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric" })
        const td_date = document.createElement("td")
        td_date.innerHTML = createdDate
        tr.appendChild(td_date)

        for (let key in todo) {
            const td = document.createElement("td")
            td.innerHTML = todo[key]
            tr.appendChild(td)
        }

        const td = document.createElement("td")
        td.setAttribute("class", "px-0")

        // Filters
        if (filter == "unsolved") {

            // Check
            const btn_check = document.createElement("button")
            btn_check.setAttribute("class", "btn px-1 mx-1 text-success fs-5 hover-icons")
            btn_check.addEventListener("click", () => {
                const id = tr.getAttribute("id")

                ipcRenderer.invoke("updateTodo", id, { solved: true })
            })

            const i_check = document.createElement("i")
            i_check.setAttribute("class", "fa-solid fa-check")
            btn_check.appendChild(i_check)

            // Edit
            const btn_edit = document.createElement("button")
            btn_edit.setAttribute("class", "btn px-1 mx-1 text-primary fs-5 hover-icons")
            btn_edit.setAttribute("data-bs-toggle", "modal")
            btn_edit.setAttribute("data-bs-target", "#editTodo")
            btn_edit.addEventListener("click", () => {
                sessionStorage.setItem("currentEditId", id)

                const modal_body = document.querySelector("#edit-modal-body")
                modal_body.querySelectorAll("input").forEach(input => {
                    input.value = todo[input.id.replaceAll("edit_", "")]
                })
            })

            const i_edit = document.createElement("i")
            i_edit.setAttribute("class", "fa-solid fa-pen")
            btn_edit.appendChild(i_edit)

            // Delete
            const btn_delete = document.createElement("button")
            btn_delete.setAttribute("class", "btn px-1 mx-1 text-danger fs-5 hover-icons")
            btn_delete.setAttribute("data-bs-toggle", "modal")
            btn_delete.setAttribute("data-bs-target", "#deleteTodo")
            btn_delete.addEventListener("click", () => {
                sessionStorage.setItem("currentDeleteId", id)
                btn_delete.removeEventListener("click")
            })

            const i_delete = document.createElement("i")
            i_delete.setAttribute("class", "fa-solid fa-trash")
            btn_delete.appendChild(i_delete)

            td.appendChild(btn_check)
            td.appendChild(btn_edit)
            td.appendChild(btn_delete)

            tr.appendChild(td)
        }
        else if (filter == "solved") {

            // Return
            const btn_return = document.createElement("button")
            btn_return.setAttribute("class", "btn mx-0 px-0 text-success fs-5 hover-icons")
            btn_return.addEventListener("click", () => {
                const id = tr.getAttribute("id")

                ipcRenderer.invoke("updateTodo", id, { solved: false })
            })

            const i_return = document.createElement("i")
            i_return.setAttribute("class", "fa-solid fa-rotate-left")
            btn_return.appendChild(i_return)

            td.appendChild(btn_return)

            tr.appendChild(td)
        }

        tbody.appendChild(tr)
    })
})