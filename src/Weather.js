import React, { Component } from 'react'
import { getSunrise, getSunset } from 'sunrise-sunset-js'
import Emoji from './Emoji'
import nightWeatherEmojis from './nightWeatherEmojis'
import weatherEmojis from './weatherEmojis'
import './Weather.css'
import { getFmiWeatherData, getLatestTemp } from './Requests'
import { parseXmlWeatherData, formatTime } from './utils/utils'

const HELSINKI_LAT = 60.192059
const HELSINKI_LNG = 24.945831

const isNight = date => {
  const sunrise = getSunrise(HELSINKI_LAT, HELSINKI_LNG, new Date(date)).toISOString()
  const sunset = getSunset(HELSINKI_LAT, HELSINKI_LNG, new Date(date)).toISOString()

  return date < sunrise || date > sunset
}

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {
      forecast: null,
      latest: null,
    }
  }

  componentDidMount() {
    this.getCurrentWeatherData()
    setInterval(() => {
      this.getCurrentWeatherData()
    } , 600000)


    setTimeout(() => {
      window.location.reload()
    }, 1000 * 60 * 60 * 24)
  }

  getCurrentWeatherData() {
    try {
      Promise.all([
        getLatestTemp(),
        getFmiWeatherData(),
      ]).then(([ latest, weatherData ]) => {
        parseXmlWeatherData(weatherData).then(forecast => {
          this.setState({ forecast })
        })
        this.setState({ latest })
      })
        .catch(err => {
          console.warn('Error getting weather data', err)
        })
    } catch (err) {
      console.warn('Error getting weather data', err)
    }
  }

  chooseIcon(temp, icon, time) {
    const night = isNight(time)

    if (temp > 20 && icon === 1) {
      return ":sun_with_face:"
    } else if (temp <= -10 && icon >= 41 && icon <= 53) {
      return ":snowman2:"
    } else {
      return (night && nightWeatherEmojis[icon]) || weatherEmojis[icon] || ':poop:'
    }
  }

  renderWeatherItem(weather) {
    const key = weather.time + '-' + weather.windspeedms
    return (
      <div className="Weather__item__box" key={weather.time}>
        <div className="Weather__item__time">{ formatTime(weather.time)}</div>
        <div className="Weather__item__temp">{ Math.round(weather.temperature) }°</div>
        <Emoji name={ this.chooseIcon(Math.round(weather.temperature), weather.weathersymbol3, weather.time) }/>
        <div className="Weather__item__wind" key={key}>
          <div className="Weather__item__wind__ms"><span className="Weather__item__wind__value">{ Math.round(weather.windspeedms) }</span></div>
        </div>
      </div>
    )
  }

  render() {
    const {forecast, latest} = this.state
    if (!forecast) return null
    return (
      <div className="Weather">

         <div className="Weather__item">
           { latest &&
             <div className="Weather__current">
               <div className="Weather__item__currentTemp">{ latest.temperature }°</div>
               <div className="Weather__item__currentWind"><span className="Weather__item__wind__value">{ Math.round(latest.windspeedms) }</span></div>
             </div>
           }
           { forecast
              .filter(item => item.time > new Date().toISOString())
              .slice(1, 20)
              .filter((w, key) => key % 3 === 0)
              .slice(0, 5)
              .map(weather => this.renderWeatherItem(weather))
           }
         </div>
       </div>
    )
  }
}

export default Weather
