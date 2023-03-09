# Electron To-Do Application
This is a basic To-Do application written using Electron. Users can add, edit and delete to-dos.


## Installation
1. First, install the dependencies using `npm install`.
2. Then, run the application using `npm start`.
3. To create an executable, run `npm run make`.

## Important Notes
- The application uses a local JSON file to store the to-dos. This file is located in the `database` folder. Since the application is not connected to a database, the to-dos will not be saved if the database.json file is deleted.
- Note that this application is a test project. Storing to-dos in a local JSON file is a terrible idea. This method may be inefficient in terms of memory usage and performance for large amounts of data.

## Images
![Homepage](https://i.imgur.com/zuz5fpY.png)
![Add](https://i.imgur.com/UOnSLAF.png)
![Edit](https://i.imgur.com/vDkRaUn.png)
![Solved To-Dos](https://i.imgur.com/YyuWkSp.png)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.