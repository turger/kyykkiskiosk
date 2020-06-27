import React, { Component } from 'react'
import './Weather.css'

class Weather extends Component {
  render() {
    const { weatherData } = this.props
    if (!weatherData) return null

    return (
      <div className="Weather">
        <table className="forecast" dangerouslySetInnerHTML={{__html: weatherData.forecast}}/>
      </div>
    )
  }

}

export default Weather
