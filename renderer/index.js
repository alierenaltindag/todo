async function registerTodo() {

    const data = {}
    const modal_body = $("#register-modal-body")[0]

    modal_body.querySelectorAll("input").forEach(input => { data[input.id] = input.value })

    if (Object.values(data).some(v => v === "")) {
        const alert = document.createElement("div")
        alert.classList.add("alert", "alert-danger", "fade", "show", "text-center")
        alert.setAttribute("role", "alert")
        alert.innerHTML = `
            Please fill all fields!
            `
        document.querySelector("body").prepend(alert)

        setTimeout(() => {
            alert.remove()
        }, 3000);
    }
    else {
        window.todos.registerTodo(data)
        $("#addTodoModal").modal('hide')

        // Bootstrap alert
        const alert = document.createElement("div")
        alert.classList.add("alert", "alert-success", "fade", "show", "text-center")
        alert.setAttribute("role", "alert")
        alert.innerHTML = `
            To do successfully added!
            `
        document.querySelector("body").prepend(alert)

        // Reset input fields
        modal_body.querySelectorAll("input").forEach(input => { input.value = "" })

        // Focus on first input
        modal_body.querySelector("input").focus()

        // Dismiss alert after 3 seconds
        setTimeout(() => {
            alert.remove()
        }, 3000);
    }
}

function editTodo() {
    const id = sessionStorage.getItem("currentEditId")
    const data = {}
    const modal_body = $("#edit-modal-body")[0]

    modal_body.querySelectorAll("input").forEach(input => { data[input.id.replaceAll("edit_", "")] = input.value })

    if (Object.values(data).some(v => v === "")) {
        // Alert
        const alert = document.createElement("div")
        alert.classList.add("alert", "alert-danger", "fade", "show", "text-center")
        alert.setAttribute("role", "alert")
        alert.innerHTML = `
            Please fill all fields!
            `
        document.querySelector("body").prepend(alert)

        setTimeout(() => {
            alert.remove()
        }, 3000);
    } else {

        // Update todo
        console.log(data)
        window.todos.updateTodo(id, data)

        // Close modal
        $("#editTodo").modal('hide')

        // Alert
        const alert = document.createElement("div")
        alert.classList.add("alert", "alert-success", "fade", "show", "text-center")
        alert.setAttribute("role", "alert")
        alert.innerHTML = `
            To do has been updated!
            `
        document.querySelector("body").prepend(alert)

        setTimeout(() => {
            alert.remove()
        }, 3000);
    }

    sessionStorage.removeItem("currentEditId")
}

function deleteTodo() {
    const id = sessionStorage.getItem("currentDeleteId")
    window.todos.deleteTodo(id)
    $("#deleteTodo").modal('hide')

    // Alert
    const alert = document.createElement("div")
    alert.classList.add("alert", "alert-success", "fade", "show", "text-center")
    alert.setAttribute("role", "alert")
    alert.innerHTML = `
        To do has been deleted!
        `
    document.querySelector("body").prepend(alert)

    setTimeout(() => {
        alert.remove()
    }, 3000);

    sessionStorage.removeItem("currentDeleteId")
}

// When press enter on focused last input field. Call registerTodo function
$("#register-modal-body input:last").on("keyup", function (e) {
    if (e.keyCode === 13) {
        registerTodo()
    }
})

// Search
$("#searchInput").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    window.todos.filterTodos(value)
});

$("#registerTodo").on('shown.bs.modal', function () {
    $("#register-modal-body input:first").trigger('focus')
    $('#register-modal-body input').val("")
})

$('#editTodo').on('shown.bs.modal', function () {
    $('#edit-modal-body input:first').trigger('focus')
})

$('#deleteTodo').on('shown.bs.modal', function () {
    $('#confirmBtn').trigger('focus')
})