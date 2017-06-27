import React, { Component } from 'react'
import './Weather.css'

class Weather extends Component {
  render() {
    const { weatherData } = this.props
    if (!weatherData) return null
    return (
      <div className="Weather">
        { weatherData.latestTemp }°
      </div>
    )
  }

}

export default Weather
