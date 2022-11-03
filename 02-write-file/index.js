const fs = require('fs')
const path = require('path')
const fileAddress = path.join(__dirname, 'newText.txt')

const readStream = process.stdin
const writeStream = fs.createWriteStream(fileAddress)

readStream.pipe(writeStream)
console.log('Enter your text');

readStream.on('data', (chunk) => {
  const stringChunk = chunk.toString()
  if (stringChunk.match('exit')) {
    readStream.unpipe(writeStream)
  }
})

writeStream.on('unpipe', () => {
  console.log('Thanks for your text! Good luck!');
})

process.on('SIGINT', () => {
  console.log('\nThanks for your text! Good luck!');
  process.exit()
})