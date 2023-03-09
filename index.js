const { app, ipcMain } = require('electron')
const database = require('./database/database.js')
const path = require('path')

const Window = require('./window')

function main() {
    let mainWindow = new Window({
        file: path.join(__dirname, "renderer", "index.html"),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    mainWindow.once('show', () => {
        mainWindow.webContents.send('todos', database.getTodos("unsolved"))
    })

    ipcMain.handle('registerTodo', (event, todo) => {
        const updatedTodos = database.registerTodo(todo)

        mainWindow.send('todos', updatedTodos)
    })

    ipcMain.handle('deleteTodo', (event, todo_id) => {
        const updatedTodos = database.deleteTodo(todo_id)

        mainWindow.send('todos', updatedTodos)
    })

    ipcMain.handle('updateTodo', (event, todo_id, data) => {
        const updatedTodos = database.updateTodo(todo_id, data)

        mainWindow.send('todos', updatedTodos)
    })

    ipcMain.handle('refreshTodos', (event) => {
        const todos = database.getTodos()

        mainWindow.webContents.send('todos', todos)
    })

    ipcMain.handle('filterTodos', (event, value) => {

        const todos = database.getTodos()

        const filteredTodos = Object.fromEntries(Object.entries(todos).filter(([id, data]) => {
            const copied = { ...data }
            delete copied.createdTimestamp
            delete copied.solved

            return Object.values(copied).some(v => v.toLocaleLowerCase("tr").includes(value.toLocaleLowerCase("tr")))
        }))

        mainWindow.webContents.send('todos', filteredTodos)
    })
}

app.disableHardwareAcceleration()

app.on('ready', main)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})