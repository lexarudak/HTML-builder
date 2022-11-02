// task start

const path = require('path')
const fs = require('fs')
const textAddress = path.join(__dirname, 'text.txt')
const readStream = fs.createReadStream(textAddress)
let answer = ''

readStream.on('data', function (chunk) {
  answer += chunk.toString()
})

readStream.on('end', function () {
  console.log(answer);
})

