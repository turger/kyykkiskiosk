import React, { Component } from 'react'
import _ from 'lodash'
import './Stops.css'
import Stop from './Stop'
import { getSchedulesForStop } from './Requests'

const STOP_IDS = 'HSL:2423207,HSL:2423228'

class Stops extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stopsData: {},
      errorMessage: null,
    }
  }

  componentDidMount() {
    this.getStopsData()
    setInterval(() => {
      this.getStopsData()
    } , 60000)
  }

  getStopsData() {
    const stopIds = STOP_IDS ? STOP_IDS.split(',') : []
    if (_.isEmpty(stopIds)) this.setState({errorMessage: 'No stops found!'})
    stopIds.forEach((stopId,i) => {
      if (stopId.includes(';')) {
        stopId.split(';').forEach(stopId => this.getSchedules(stopId, i, {merge: true}))
      } else {
        this.getSchedules(stopId, i)
      }
    })
  }

  getSchedules = (stopId, i, {merge = false} = {}) => {
    getSchedulesForStop(stopId).then(stopTimes => {
      const stopsData = this.state.stopsData
      stopsData[i] = merge ? this.mergeStops(stopsData[i], stopTimes) : stopTimes
      this.setState({ stopsData })
    })
  }

  mergeStops = (currentStopTimes, newStopTimes) => {
    if (!currentStopTimes || _.isEmpty(newStopTimes)) return newStopTimes
    if (_.get(currentStopTimes, 'gtfsId').includes(_.get(newStopTimes, 'gtfsId'))) return newStopTimes
    const mergedStopTimes = {}
    Object.keys(newStopTimes).forEach(i => {
      if(typeof newStopTimes[i] === 'string') {
        mergedStopTimes[i] = ```${newStopTimes[i]};${currentStopTimes[i]}`
      } else {
        mergedStopTimes[i] = _.orderBy([...currentStopTimes[i], ...newStopTimes[i]], ['serviceDay', 'realtimeArrival'])
      }
    })
    return mergedStopTimes
  }

  render() {
    const {stopsData, errorMessage} = this.state
    if (!stopsData) return null
    return (
      <div className="Stops">
        { errorMessage && <div>{errorMessage}</div> }
        { Object.keys(stopsData)
          .sort((a, b) => a > b)
          .map( key =>
            <div className="Stops__box" key={key}>
              {stopsData[key] &&
                <Stop stops={stopsData[key].stoptimesWithoutPatterns} directions={stopsData[key].patterns}/>
              }
            </div>
          )
        }
      </div>
    )
  }

}

export default Stops
