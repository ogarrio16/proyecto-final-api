// app.js
require('dotenv').config()
const express = require('express')
const path = require('path')
const getWeather = require('./src/utils/weather')

const app = express()
const PORT = process.env.PORT || 3000

// Servir assets estáticos
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint API: /weather?address=London
app.get('/weather', async (req, res) => {
  const address = req.query.address
  if (!address || address.trim().length === 0) {
    return res.status(400).json({ error: 'You must provide an address (city or city,country).' })
  }

  try {
    const data = await getWeather(address)
    // getWeather returns an object with either error or result
    if (data.error) {
      return res.status(400).json({ error: data.error })
    }
    res.json(data)
  } catch (err) {
    console.error('Unexpected error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Fallback: index.html already served by static
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
