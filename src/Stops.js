import React from 'react'
import './Stops.css'
import { minutesToDeparture, getTimeIfMoreThan60min } from './utils'

const stopKey = stopTime => `${stopTime.trip.route.gtfsId}-${stopTime.realtimeArrival}`
const filterFourMin = stopTime => !Number.isInteger(minutesToDeparture(stopTime)) || minutesToDeparture(stopTime) > 4
const parseStops = stops => {
  return Object.keys(stops)
    .reduce((stopsArr, key) => {
      stopsArr.push(stops[key])
      return stopsArr
    }, [])
    .map(stop => stop.stoptimesWithoutPatterns
      .filter(filterFourMin)
      .slice(0, 2)
    )
    .reduce((flattedStops, stop) => [...flattedStops, ...stop], [])
    .sort((a, b) => minutesToDeparture(a) - minutesToDeparture(b))
}


const Stop = ({stops}) => {
  return (
    <div className="Stops">
      { parseStops(stops).map(stopTime => (
        <div className="Stops__item" key={stopKey(stopTime)}>
          <div className="Stops__item--name">
            {stopTime.trip.route.shortName}
          </div>
          <div className="Stops__item--time">
            { getTimeIfMoreThan60min(minutesToDeparture(stopTime), stopTime.realtimeArrival) }
          </div>
        </div>
      ))}
    </div>
  )
}

export default Stop
