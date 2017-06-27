import React, { Component } from 'react'
import moment from 'moment'
import './Footer.css'
import Stops from './Stops'
import Weather from './Weather'
import Clock from './Clock'
import { getSchedulesForStop, getWeatherData } from './services/requests'
import { STOP_MK, STOP_VN } from './constants'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopData: undefined,
      weatherData: undefined,
      dateTime: undefined
    }
  }

  componentDidMount() {
    this.getData()
    this.getWeatherData(2)
    this.getDateTime()
    setInterval(() => {
      this.getData()
    } , 60000)
    setInterval(() => {
      this.getWeatherData()
    } , 600000)
    setInterval(() => {
      this.getDateTime()
    } , 1000)
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

  getDateTime() {
    let dateTime = moment().format("ddd D.M.YYYY HH:mm:ss")
    dateTime = dateTime.replace("Mon", "Maanantai").replace("Tue", "Tiistai").replace("Wed", "Keskiviikko").replace("Thu", "Torstai").replace("Fri", "Perjantai").replace("Sat", "Lauantai").replace("Sun", "Sunnuntai")
    this.setState({ dateTime })
  }

  render() {
    if (!this.state.stopData) return null
    return (
      <div className="Footer">
        <Clock dateTime={this.state.dateTime} />
        <Stops stops={this.state.stopData} />
        <Weather weatherData={ this.state.weatherData } />
      </div>
    )
  }
}

export default Footer
