const fs = require('fs')
const path = require('path')
const styleFolder = path.join(__dirname, 'styles')
const cssBundle = path.join(__dirname, 'project-dist', 'bundle.css')



fs.readdir(styleFolder, (err, data) => {
  const arr = []
  data.forEach((val) => {
    const ext = path.extname(val) 
    if (ext === '.css') {
      const stream = new fs.ReadStream(path.join(styleFolder, val), {encoding: 'utf-8'})
      let allText = ''
      stream.on('readable', () => {
        const text = stream.read()
        if (text !== null) {
          allText += text
        }
      })
      stream.on('end', () => {
        arr.push(allText)
        const writeText = arr.join('\n')
        const writeStream = fs.createWriteStream(cssBundle)
        writeStream.write(writeText)
      })
    }
  })
})
