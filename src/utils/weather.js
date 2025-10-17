// src/utils/weather.js
const fetch = require('node-fetch')

const WEATHERSTACK_KEY = process.env.WEATHERSTACK_KEY
if (!WEATHERSTACK_KEY) {
  console.warn('Warning: WEATHERSTACK_KEY not set. Set it in .env or in environment variables.')
}

// Returns { error } OR { location, current }
async function getWeather(address) {
  try {
    const encoded = encodeURIComponent(address)
    const url = `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_KEY}&query=${encoded}&units=m`
    const resp = await fetch(url, { timeout: 8000 })
    if (!resp.ok) {
      return { error: `Weather service responded with ${resp.status}` }
    }

    const json = await resp.json()
    // WeatherStack returns { success: false, error: { code, info } } on error (paid/usage)
    if (json.error) {
      // pass the provider message
      return { error: json.error.info || 'Unable to get weather for that location.' }
    }
    if (!json.current || !json.location) {
      return { error: 'Malformed response from weather service.' }
    }

    return {
      location: {
        name: json.location.name,
        country: json.location.country,
        region: json.location.region,
        localtime: json.location.localtime
      },
      current: {
        temperature: json.current.temperature,
        feelslike: json.current.feelslike,
        weather_descriptions: json.current.weather_descriptions,
        wind_speed: json.current.wind_speed,
        humidity: json.current.humidity,
        observation_time: json.current.observation_time
      }
    }
  } catch (err) {
    // network/timeouts etc.
    console.error('getWeather error:', err)
    return { error: 'Unable to connect to weather service.' }
  }
}

module.exports = getWeather
