// src/App.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

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

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = countries.filter(country =>
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
        </div>
      );
    } else if (countriesToShow.length > 1 && countriesToShow.length <= 10) {
      return countriesToShow.map(country => (
        <div key={country.cca3}>
          {country.name.common}
        </div>
      ));
    } else if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>
    } else {
      return <p>No matches found</p>
    }
  }

  return (
    <div>
      <div>find countries <input value={filter} onChange={handleFilterChange} /></div>
      {showCountries()}
    </div>
  )
}

export default App
