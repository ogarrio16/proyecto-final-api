// public/app.js
const addressInput = document.getElementById('address')
const searchBtn = document.getElementById('search')
const messageEl = document.getElementById('message')
const outputEl = document.getElementById('output')

async function doSearch() {
  const address = addressInput.value.trim()
  messageEl.textContent = ''
  outputEl.style.display = 'none'
  if (!address) {
    messageEl.innerHTML = '<p class="error">Please enter a location.</p>'
    return
  }

  messageEl.textContent = 'Loading...'
  try {
    const res = await fetch(`/weather?address=${encodeURIComponent(address)}`)
    const data = await res.json()

    if (!res.ok) {
      messageEl.innerHTML = `<p class="error">${data.error || 'Error fetching weather'}</p>`
      return
    }

    messageEl.textContent = ''
    outputEl.style.display = 'block'
    outputEl.innerHTML = `
      <h3>${data.location.name}, ${data.location.country} (${data.location.region})</h3>
      <p><strong>Local time:</strong> ${data.location.localtime}</p>
      <p><strong>Temperature:</strong> ${data.current.temperature} °C (feels like ${data.current.feelslike} °C)</p>
      <p><strong>Weather:</strong> ${data.current.weather_descriptions.join(', ')}</p>
      <p><strong>Wind speed:</strong> ${data.current.wind_speed} km/h</p>
      <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
      <p><small>Observation time: ${data.current.observation_time}</small></p>
    `
  } catch (err) {
    messageEl.innerHTML = `<p class="error">Network error: ${err.message}</p>`
  }
}

searchBtn.addEventListener('click', doSearch)
addressInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') doSearch() })
