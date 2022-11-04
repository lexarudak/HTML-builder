const fs = require('fs')
const path = require('path')
const folder = path.join(__dirname, 'files')
const newFolder = path.join(__dirname, 'files-copy')


fs.mkdir(newFolder, { recursive: true }, (err) => {
  if (err) {
    console.log(err.message);  
  }
  fs.readdir(folder, (err, data) => {
    data.forEach(value => {
      fs.copyFile(path.join(folder, value), path.join(newFolder, value), (err) => {
        if (err) {
          console.log(err.message);
        }
      })
    })
  })
 })

