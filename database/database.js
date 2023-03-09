const database = require('./database.json');
const { randomUUID } = require("crypto")
const fs = require('fs');
const path = require("path")

function writeDatabase(data) {
    fs.writeFile(path.join(__dirname, "database.json"), JSON.stringify(data), (err) => {
        if (err) console.error(err)
    })
}

module.exports.registerTodo = (data) => {
    const random_id = randomUUID()

    data.createdTimestamp = Date.now()
    data.solved = false
    database[random_id] = data;

    writeDatabase(database)

    return database;
}

module.exports.getTodos = () => {
    return database
}

module.exports.deleteTodo = (id) => {
    delete database[id];

    writeDatabase(database)

    return database;
}

module.exports.updateTodo = (todo_id, data) => {
    Object.entries(data).forEach(([key, value]) => {
        database[todo_id][key] = value
    })

    writeDatabase(database)

    return database;
}