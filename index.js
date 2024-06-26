const express = require('express')
const path = require('path')
const fs = require('fs')
// const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

// Parse JSON bodies for this app. This is needed for the POST request
app.use(express.json({ limit: '50mb' }))

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')))

app.get('/get', (req, res) => {
  const domain = req.query.server
  const filePath = './public/source.pdf'
  const fileData = fs.readFileSync(filePath, { encoding: 'base64' })

  res.json({
    postUrl: `${domain}/post`,
    timeStampUrl: 'https://freetsa.org/tsr',
    timeStampUserName: '',
    timeStampPassword: '',
    fileCollection: [
      {
        fileID: 'source',
        fileDisplayname: 'source.pdf',
        fileBase64: fileData
      }
    ]
  })
})

app.post('/post', (req, res) => {
  const body = req.body
  console.log(body)
  const base64 = body.fileCollection[0].fileBase64
  fs.writeFile('./public/target.pdf', base64, { encoding: 'base64' }, err => {
    if (err) {
      console.error(err)
      res.status(500).send('Error saving file')
    } else {
      res.send('File saved successfully')
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
