import React, { Component } from 'react'
import { ReactSVG } from 'react-svg'
import { getBikes } from './Requests'
import Circle from './assets/circle.svg'
import './Bikes.css'
import _ from 'lodash'

class Bikes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bikesData: {},
      errorMessage: null,
    }
    this._bikesBoxes = {}
  }

  componentDidMount() {
    this.getBikesData()
    setInterval(() => {
      this.getBikesData()
    } , 60000)
  }

  componentDidUpdate() {
    Object.keys(this._bikesBoxes).forEach(i => {
      const bikesBox = this._bikesBoxes[i]
      bikesBox.obj && bikesBox.obj.style.setProperty('--percentage', bikesBox.percentage)
    })
  }

  getBikesData() {
    const bikeStopIds = process.env.REACT_APP_BIKE_STOP_IDS ? process.env.REACT_APP_BIKE_STOP_IDS.split(',') : []
    if (_.isEmpty(bikeStopIds)) this.setState({errorMessage: 'No stops found!'})
    bikeStopIds.forEach(pair => {
      const name = pair.split(':')[0]
      const id = pair.split(':')[1]
      getBikes(id).then(bikeStopTimes => {
        let bikesData = this.state.bikesData
        bikesData[name] = bikeStopTimes
        this.setState({ bikesData })
      })
    })
  }

  render() {
    const {bikesData, errorMessage} = this.state
    if (!bikesData) return null
    return (
      <div className="Bikes">
        { errorMessage && <div>{errorMessage}</div> }
        { Object.keys(bikesData)
          .sort((a, b) => a > b)
          .map( key => {
            const bikesAvailable = _.get(bikesData, `${key}.bikesAvailable`)
            const spacesAvailable = _.get(bikesData, `${key}.spacesAvailable`)
            const percentage = Math.round((bikesAvailable/(bikesAvailable+spacesAvailable))*100) || 0
            return (
              <div className="BikeStop" key={key} ref={c => (this._bikesBoxes[key] = {percentage, obj: c})}>
                <ReactSVG
                  src={Circle}
                  className="Percentage__circle"
                />

                <div className="BikeStop__availability">
                  <div className="BikeStop__availability__name">
                    { key }
                  </div>
                  <div className="BikeStop__availability__amount">
                    { bikesAvailable }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

}

export default Bikes
