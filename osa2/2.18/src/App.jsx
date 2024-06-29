import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data: ', error)
      })
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      if (selectedCountry) {
        const capital = selectedCountry.capital[0]
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

        try {
          const response = await axios.get(weatherApiUrl)
          setWeather(response.data)
        } catch (error) {
          console.error('Error fetching weather:', error)
        }
      }
    }

    fetchWeather()
  }, [selectedCountry, api_key])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const showCountries = () => {
    if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>capital {country.capital[0]}</p>
          <p>area {country.population}</p>
          <p><strong>Languages:</strong></p>
          <ul>
            {Object.values(country.languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt="Flag" style={{ width: '150px' }} />
          {weather && (
            <div>
              <strong>Weather in: {country.name.common}</strong>
              <p>temperature: {weather.main.temp} Celsius</p>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
              <p>wind {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      )
    } else if (countriesToShow.length > 1 && countriesToShow.length <= 10) {
      return (
        <div>
          {countriesToShow.map((country) => (
            <div key={country.cca3}>
              <button onClick={() => handleCountrySelect(country)}>
                {country.name.common}
              </button>
            </div>
          ))}
          {selectedCountry && (
            <div>
              <h2>{selectedCountry.name.common}</h2>
              <p>capital {selectedCountry.capital[0]}</p>
              <p>area {selectedCountry.population}</p>
              <p><strong>Languages:</strong></p>
              <ul>
                {Object.values(selectedCountry.languages).map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
              <img src={selectedCountry.flags.png} alt="Flag" style={{ width: '150px' }} />
              {weather && (
                <div>
                  <strong>Weather in: {selectedCountry.name.common}</strong>
                  <p>temperature: {weather.main.temp} Celsius</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                  <p>wind {weather.wind.speed} m/s</p>
                </div>
              )}
            </div>
          )}
        </div>
      )
    } else if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>
    } else {
      return <p>No matches found</p>
    }
  }

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      {showCountries()}
    </div>
  )
}

export default App
