const fs = require('fs')
const path = require('path')
const folder = path.join(__dirname, 'secret-folder')


fs.readdir(folder, {withFileTypes: true}, (err, data) => {
  data.forEach(val => {

    let answer = ''
    if (val.isFile()) {
      fs.stat(path.join(folder,val.name), (err, data) => {
      const name = val.name.replace(path.extname(val.name), '')
      const ext = path.extname(val.name).replace('.', '')
      const size = data.size / 1000 + 'kb'
      answer = answer + name + ' - ' + ext + ' - ' + size
      console.log(answer);
    })  
   }
  })
})



