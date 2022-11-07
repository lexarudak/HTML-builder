const fs = require('fs')
const fsp = require('fs/promises');
const path = require('path')
const assets = path.join(__dirname, 'assets')
const newAssets = path.join(__dirname, 'project-dist', 'assets')
const styleFolder = path.join(__dirname, 'styles')
const cssBundle = path.join(__dirname, 'project-dist', 'style.css')
const templateFile = path.join(__dirname, 'template.html')
const componentsFiles = path.join(__dirname, 'components')
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

async function setHtml () {
  await fsp.rm(newAssets, { recursive: true, force: true })
  await fsp.mkdir(newAssets, { recursive: true })
  copy(assets, newAssets)
 
  await mergeStyles(styleFolder, '.css', cssBundle)

  let template = await fsp.readFile(templateFile, {encoding: 'utf-8'})
  const componentsArr = await makeTextArr(componentsFiles, '.html')
  componentsArr.textArrWithName.forEach((val) => {
    template =  template.replace(new RegExp(`{{${val[0]}}}`,'g'), val[1])
  })
  const writeStreamHtml = fs.createWriteStream(newHtml)
  writeStreamHtml.write(template)
}
setHtml()