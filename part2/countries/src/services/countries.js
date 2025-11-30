import axios from 'axios'

const urlAll = "https://studies.cs.helsinki.fi/restcountries/api/all"
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name/"
const api_key = import.meta.env.VITE_OPENWEATHER_KEY

const getAll = () => {
    return axios.get(urlAll).then(response => response.data).then(countries => countries.map(c => c.name.common))
}

const getCountry = (countryName) => {
    return axios.get(`${baseUrl}${countryName}`).then(response => response.data).then(c =>{   
        return {
            name: c.name.common,
            capital: c.capital,
            area: c.area,
            languages: Object.values(c.languages),
            flag: { png: c.flags.png, alt: c.flags.alt }
        }
    })
}

const getWeather = (cityName) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=metric`)
                .then(response => response.data).then(weather => {
                    return {
                        name: weather.name,
                        temperature: weather.main.temp,
                        wind: weather.wind.speed,
                        icon: {
                            png: `https://openweathermap.org/img/wn/${weather.weather.at(0).icon}@2x.png`,
                            alt: weather.weather.at(0).description
                        }             
                    }
                })
}

export default {getAll, getCountry, getWeather}