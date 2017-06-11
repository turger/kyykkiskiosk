import React, { Component } from 'react'
import Emoji from './Emoji'
import weatherEmojis from './weatherEmojis'
import './Weather.css'

class Weather extends Component {
  chooseIcon(temp, icon) {
    if (temp > 20 && (icon === '01d' || icon === '01n')) {
      return ":fire:"
    } else if (temp <= -10 && (icon === '13d' || icon === '13n')) {
      return ":snowman2:"
    } else {
      return weatherEmojis[icon]
    }
  }

  render() {
    const { weatherData } = this.props
    if (!weatherData) return null
    const temp = weatherData.main.temp
    const icon = weatherData.weather[0].icon
    return (
      <div className="Weather">
        { temp }°
        <Emoji name={ this.chooseIcon(temp, icon) }/>
      </div>
    )
  }

}

export default Weather
