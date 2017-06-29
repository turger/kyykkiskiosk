import React, { Component } from 'react'
import './Weather.css'

class Weather extends Component {
  render() {
    const { weatherData } = this.props
    if (!weatherData) return null

    return (
      <div className="Weather">
        <div className="latest" style={{"font-size": "45px"}}>
          <div style={{"margin-bottom": "10px", "font-size": "25px", "text-align": "center"}}>Nyt</div>
          <div>{ weatherData.latestTemp }°</div>
        </div>
        <table className="forecast" dangerouslySetInnerHTML={{__html: weatherData.forecast}}/>
      </div>
    )
  }

}

export default Weather
