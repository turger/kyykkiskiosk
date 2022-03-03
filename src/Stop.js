import React from 'react'
import './Stop.css'
import { minutesToDeparture } from './utils/utils'
import Vehicle from './Vehicle'

const Stop = ({stops, directions}) => (
  <div className="Stop">
    {stops
      .filter(stopTime => {
        const timeToDeparture = minutesToDeparture(stopTime.realtimeArrival, stopTime.serviceDay)
        return(!Number.isInteger(timeToDeparture) || timeToDeparture >= 3)}
      )
      .slice(0, 3)
      .map(stopTime => {
        const timeToDeparture = minutesToDeparture(stopTime.realtimeArrival, stopTime.serviceDay)
        return(
          <div className="Stop__route" key={`${stopTime.trip.route.gtfsId}-${stopTime.realtimeArrival}`}>
            <Vehicle mode={ stopTime.trip.route.mode }/>
            <div className="Stop__route--number">
              {stopTime.trip.route.shortName}
            </div>
            <div className="Stop__route--headsign">
              {directions.find(direction => direction.route.shortName === stopTime.trip.route.shortName).headsign}
            </div>
            <div className="Stop__route--time">
                <span>{ timeToDeparture }</span>
                <span className="Stop__route--time--mins">min</span>
            </div>
          </div>
        )
      }
    )}
  </div>
)

export default Stop
