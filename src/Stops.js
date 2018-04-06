import React from 'react'
import './Stops.css'
import { minutesToDeparture, getTimeIfMoreThan60min } from './utils'

const stopKey = stopTime => `${stopTime.trip.route.gtfsId}-${stopTime.realtimeArrival}`
const filterMinusMin = stopTime => !Number.isInteger(minutesToDeparture(stopTime)) || minutesToDeparture(stopTime) > -1
const parseStops = stops => {
  return Object.keys(stops)
    .reduce((stopsArr, key) => {
      stopsArr.push(stops[key])
      return stopsArr
    }, [])
    .map(stop => stop.stoptimesWithoutPatterns
      .filter(filterMinusMin)
      .slice(0, 4)
    )
    .reduce((flattedStops, stop) => [...flattedStops, ...stop], [])
    .sort((a, b) => minutesToDeparture(a) - minutesToDeparture(b))
}

const LineName = (name) => {
  const number = name.substring(0, 2)
  const letter = name.substring(2, name.length)
  return (
    <div className="Stops__item--name">
      <span>{number}</span><span className="Stops__item--letter">{letter}</span>
    </div>
  )
}

const Stop = ({stops}) => {
  return (
    <div className="Stops">
      { parseStops(stops).map(stopTime => (
        <div className="Stops__item" key={stopKey(stopTime)}>
          <div className="Stops__item--name">
            {LineName(stopTime.trip.route.shortName)}
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
