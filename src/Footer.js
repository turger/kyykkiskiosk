import React, { Component } from 'react'
import './Footer.css'
import Stops from './Stops'
import Weather from './Weather'
import { getSchedulesForStop, getWeatherData } from './Requests'
import { STOP_MK, STOP_VN } from './constants'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopData: undefined,
      weatherData: undefined,
    }
  }

  componentDidMount() {
    this.getData()
    this.getWeatherData(2)
    setInterval(() => {
      this.getData()
    } , 60000)
    setInterval(() => {
      this.getWeatherData()
    } , 600000)
  }

  getData() {
    this.getDataForStop(STOP_MK)
    this.getDataForStop(STOP_VN)
  }

  getDataForStop(stopId) {
    getSchedulesForStop(stopId).then(stopTimes => {
      let stopData = this.state.stopData || {}
      stopData[stopId] = stopTimes
      this.setState({ stopData })
    })
  }

  getWeatherData() {
    getWeatherData().then(weatherData => {
      this.setState({ weatherData })
    })
  }

  render() {
    if (!this.state.stopData) return null
    return (
      <div className="Footer">
        <Stops stops={this.state.stopData}/>
        <Weather weatherData={ this.state.weatherData } />
      </div>
    )
  }
}

export default Footer
