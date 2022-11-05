const fs = require('fs')
const path = require('path')
const styleFolder = path.join(__dirname, 'styles')
const cssBundle = path.join(__dirname, 'project-dist', 'bundle.css')



fs.readdir(styleFolder, (err, data) => {

  const arr = []
  let i = 0

  data.forEach((val, index) => {
    const ext = path.extname(val) 
    if (ext === '.css') {
      i++
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
        if (arr.length === i) {
          const writeText = arr.join('\n')
          const writeStream = fs.createWriteStream(cssBundle)
          writeStream.write(writeText)
        }
      })
    }
  })
})
