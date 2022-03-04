import React, { Component } from 'react'
import './DateTime.css'
import moment from 'moment'

const getFinnishDay = day => {
  const upperCaseDay = day.toUpperCase()

  switch (upperCaseDay) {
    case 'MONDAY':
      return 'Maanantai'
    case 'TUESDAY':
      return 'Tiistai'
    case 'WEDNESDAY':
      return 'Keskiviikko'
    case 'THURSDAY':
      return 'Torstai'
    case 'FRIDAY':
      return 'Perjantai'
    case 'SATURDAY':
      return 'Lauantai'
    case 'SUNDAY':
      return 'Sunday'
    default:
      return day
  }

}

class DateTime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeHour: null,
      timeMinute: null,
      date: null,
      day: null,
    }
  }

  componentDidMount() {
    this.setTime()
    setInterval(() => {
      this.setTime()
    } , 1000)
  }

  setTime() {
    this.setState({
      timeHour: moment().format('HH'),
      timeMinute: moment().format('mm'),
      date: moment().format('D.M.YYYY'),
      day: getFinnishDay(moment().format('dddd')),
    })
  }

  render() {
    if (!this.state.date || !this.state.timeHour) return null
    return (
      <div className="DateTime">
          <div className="DateTime__date">
            { this.state.date }
          </div>
          <div className="DateTime__time">
            <span>{ this.state.timeHour }</span>
            <span className={"Blinking"}>:</span>
            <span>{ this.state.timeMinute }</span>
          </div>
          <div className="DateTime__date">
            { this.state.day }
          </div>
      </div>
    )
  }
}

export default DateTime
