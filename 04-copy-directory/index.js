const fs = require('fs')
const path = require('path')
const folder = path.join(__dirname, 'files')
const newFolder = path.join(__dirname, 'files-copy')



function copy(dir, newDir) {
  fs.readdir(dir, {withFileTypes: true}, (err, data) => {
    data.forEach(value => {
      if (!value.isFile()) {
        fs.mkdir(path.join(newDir, value.name), { recursive: true }, (err) => {
          if (err) {
            console.log(err.message);  
          }
        })
        copy((path.join(dir, value.name)), (path.join(newDir, value.name)))
      } else {
        fs.copyFile(path.join(dir, value.name), path.join(newDir, value.name), (err) => {
          if (err) {
            console.log(err.message);
          }
        })
      }
    })
  })
}

fs.rm(newFolder, { recursive: true, force: true }, () => {
  fs.mkdir(newFolder, { recursive: true }, () => {
    copy(folder, newFolder)
  })
})