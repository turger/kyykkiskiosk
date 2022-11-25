import React, { Component } from 'react'
import * as _ from 'lodash'
import classNames from 'classnames'
import './Weather.css'
import { getLatestTemp, getYRWeatherData } from './Requests'
import { formatTime } from './utils/utils'
import YrWeatherIcon from './YrWeatherIcon'

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

  async getCurrentWeatherData() {
    try {

      const latest = await getLatestTemp()

      this.setState({ latest })

      const yrForecast = await getYRWeatherData()

      this.setState({ yrForecast: JSON.parse(yrForecast) })
    } catch (err) {
      console.warn('Error getting weather data', err)
    }
  }

  renderWeatherItem = (weather) => {
    const details = _.get(weather, "data.instant.details")
    const key = weather.time
    const symbol = _.get(weather, "data.next_1_hours.summary.symbol_code")

    const rawTemp = details.air_temperature
    const roundedString = Math.round(rawTemp).toString()
    const temperatureToShow = rawTemp < 0 && !roundedString.includes('-')
      ? `-${roundedString}`
      : roundedString

    return (
      <div className="Weather__item__box" key={key}>
        <div className="Weather__item__time">{formatTime(weather.time)}</div>
        <div className={"Weather__item__temp"}>
          {temperatureToShow}°
        </div>
        <YrWeatherIcon name={symbol} />
        <div
          className="Weather__item__wind"
          key={key}
        >
          <div className="Weather__item__wind__ms">
            {Math.round(details.wind_speed)}
          </div>
        </div>
      </div>
    )
  }


  render() {
    const {yrForecast, latest} = this.state

    const timeseries = _.get(yrForecast, "properties.timeseries")

    return (
      <div className="Weather">
         <div className="Weather__item">
           { latest &&
             <div className="Weather__current">
               <div className="Weather__item__currentTemp">{ latest.temperature }°</div>
               <div className="Weather__item__currentWind"><span className="Weather__item__current__wind__value">{ Math.round(latest.windspeedms) }</span></div>
             </div>
           }
           {timeseries && timeseries
             .slice(1, 20)
             .filter((w, key) => key % 3 === 0)
             .slice(0, 5)
             .map((weather) => this.renderWeatherItem(weather))}
         </div>
       </div>
    )
  }
}

export default Weather
