const express = require('express')
const app = express()

const PORT = 3000

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to ${PORT}`)
})
