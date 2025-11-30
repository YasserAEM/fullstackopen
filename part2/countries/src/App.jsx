import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Filter = ({value, onChange}) => {
  return (
    <div>
      find countries <input value={value} onChange={onChange} />
    </div>
  )
}

const FilteredList = ({list, onShow}) => {
  if (!list) {
    return <p>No matches</p>
  } else if (list.length === 0) {
    return <p>Too many matches, specify another filter</p>
  } else {
    return (
      <ul>
        {list.map(c => {
          return (
            <li key={c}>{c} <button onClick={onShow}>Show</button></li>)}
        )
        }
      </ul>
    )
  }
}

const Country = ({country, weather}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      Capital {country.capital} <br />
      Area {country.area}
      <h2>Languages</h2>
      <ul>
        {country.languages.map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flag.png} alt={country.flag.alt} />
      <Weather weather={weather} />
    </div>
  )
}

const Weather = ({weather}) => {
  if (!weather) return

  return (
    <>
      <h2>Weather in {weather.name}</h2>
      Temperature {weather.temperature} <br />
      <img src={weather.icon.png} alt={weather.icon.description} /> <br />
      Wind {weather.wind}
    </>
  )
}

const App = () => {
  const [country, setCountry] = useState(null)
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState(null)
  const [filtered, setFiltered] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!countries) {
      countryService.getAll().then(initCountries => setCountries(initCountries))
    }
  }, [])

  useEffect(() => {
    if (!country) {
      setWeather(null)
    } else {
      countryService.getWeather(country.capital).then(weather => setWeather(weather))
    }
  }, [country])

  const onChange = (event) => {
    const newValue = event.target.value
    setValue(newValue)

    const filteredList = countries.filter(c => c.toLowerCase().includes(newValue.toLowerCase()))
    const numOfCountries = filteredList.length
    if (numOfCountries === 1) {
      const name = filteredList.at(0)
      if (!country || country.name !== name) {
        countryService.getCountry(name).then(c => setCountry(c))
      }
    } else if (numOfCountries > 10) {
      setCountry(null)
      setFiltered([])
    } else if (numOfCountries === 0) {
      setCountry(null)
      setFiltered(null)
    } else {
      setCountry(null)
      setFiltered(filteredList)
    }
  }

  const onShow = (event) => {
    const selectedCountry = event.target.parentNode.firstChild.nodeValue
    
    setValue(selectedCountry)
    countryService.getCountry(selectedCountry).then(c => setCountry(c))
  }

  if (!countries) return <Filter value={value} onChange={onChange}/>

  return (
    <>
      <Filter value={value} onChange={onChange} />
      {(country)
      ? <Country country={country} weather={weather} />
      : <FilteredList list={filtered} onShow={onShow}/>
      }
    </>
  )
}

export default App