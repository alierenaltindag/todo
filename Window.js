const { BrowserWindow } = require('electron')

const defaultProps = {
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true
}

class Window extends BrowserWindow {
    constructor({ file, ...windowSettings }) {
        super({ ...defaultProps, ...windowSettings })

        this.loadFile(file)

        this.once("ready-to-show", () => {
            this.show()
        })
    }
}

module.exports = Window