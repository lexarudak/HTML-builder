const fs = require('fs')
const path = require('path')
const assets = path.join(__dirname, 'assets')
const newAssets = path.join(__dirname, 'project-dist', 'assets')
const styleFolder = path.join(__dirname, 'styles')
const cssBundle = path.join(__dirname, 'project-dist', 'style.css')
const template = path.join(__dirname, 'template.html')
const components = path.join(__dirname, 'components')
const newHtml = path.join(__dirname, 'project-dist', 'index.html')



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

fs.mkdir(newAssets, { recursive: true }, (err) => {
  copy(assets, newAssets)
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
  fs.readFile(template, (err, data) => {
    const arr = data.toString().split('\n')
    const cleanArr = arr.map(val => {
      return val.trim()
    })
    fs.readdir(components, {withFileTypes: true}, (err, data) => {
      data.forEach(val => {
        if (val.isFile()) {
          fs.stat(path.join(components ,val.name), (err, data) => {
            const name = val.name.replace(path.extname(val.name), '')
            const ext = path.extname(val.name).replace('.', '')
            if (ext === 'html') {
              const stream = new fs.ReadStream(path.join(components ,val.name), {encoding: 'utf-8'})
              let allText = ''
              stream.on('readable', () => {
                const text = stream.read()
                if (text !== null) {
                  allText += text
                }
              })
              stream.on('end', () => {
                arr[cleanArr.indexOf(`{{${name}}}`)] = `${allText}`
                const writeStream = fs.createWriteStream(newHtml)
                writeStream.write(arr.join('\n'))
              })
            }
          })
        }
      })
    })
  })
})