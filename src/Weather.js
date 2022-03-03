import React, { Component } from 'react'
import Emoji from './Emoji'
import weatherEmojis from './weatherEmojis'
import './Weather.css'
import { getFmiWeatherData, getLatestTemp } from './Requests'
import { parseXmlWeatherData, formatTime } from './utils/utils'

class Weather extends Component {
  constructor(props) {
    super(props)
    this.state = {
      forecast: null,
      latest: null,
    }
    this._windexes = {}
  }

  componentDidMount() {
    this.getCurrentWeatherData()
    setInterval(() => {
      this.getCurrentWeatherData()
    } , 600000)
  }

  componentDidUpdate() {
    Object.keys(this._windexes).forEach(i => {
      const windex = this._windexes[i]
      windex.obj && windex.obj.style.setProperty('--deg', windex.direction)
    })
  }

  getCurrentWeatherData() {
    Promise.all([
      getLatestTemp(),
      getFmiWeatherData(),
    ]).then(([ latest, weatherData ]) => {
      parseXmlWeatherData(weatherData).then(forecast => {
        this.setState({ forecast })
      })
      this.setState({ latest })
    })
  }

  chooseIcon(temp, icon) {
    if (temp > 20 && icon === 1) {
      return ":sun_with_face:"
    } else if (temp <= -10 && icon >= 41 && icon <= 53) {
      return ":snowman2:"
    } else {
      return weatherEmojis[icon] || ':poop:'
    }
  }

  renderWeatherItem(weather) {
    const key = weather.time + '-' + weather.windspeedms
    return (
      <div className="Weather__item__box" key={weather.time}>
        <div className="Weather__item__time">{ formatTime(weather.time)}</div>
        <div className="Weather__item__temp">{ Math.round(weather.temperature) }°</div>
        <Emoji name={ this.chooseIcon(Math.round(weather.temperature), weather.weathersymbol3) }/>
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
