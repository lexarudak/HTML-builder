const fs = require('fs')
const fsp = require('fs/promises');
const path = require('path')
const styleFolder = path.join(__dirname, 'styles')
const cssBundle = path.join(__dirname, 'project-dist', 'bundle.css')



function readStream(stream) {
  return new Promise((resolve, reject) => {
    let allText = ''
    stream.on('data', (chunk) => {
      allText += chunk
    })
    stream.on('end', () => {
      resolve(allText)
    });
  });
}



async function makeTextArr (folder, exts) {
  const textArr = []
  const textArrWithName = []
  const arr = await fsp.readdir(folder, {withFileTypes: true})
  for (let item of arr) {
    const ext = path.extname(item.name)
    if (ext === exts && item.isFile()) {
      const stream = new fs.ReadStream(path.join(folder, item.name), {encoding: 'utf-8'})
      const text = await readStream(stream)
      textArr.push(text)
      const smallArr = []
      const name = item.name.replace(path.extname(item.name), '')
      smallArr.push(name, text)
      textArrWithName.push(smallArr)
    }
  }
  return {
    textArr: textArr,
    textArrWithName: textArrWithName
  }
}

async function mergeStyles (folder, exts, way) {
  const stylesArr = await makeTextArr(folder, exts)
  const writeStreamScc = fs.createWriteStream(way)
  writeStreamScc.write(stylesArr.textArr.join('\n'))
}

mergeStyles(styleFolder, '.css', cssBundle)