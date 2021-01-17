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
      .slice(0, 2)
    )
    .reduce((flattedStops, stop) => [...flattedStops, ...stop], [])
    .sort((a, b) => minutesToDeparture(a) - minutesToDeparture(b))
}

const LineName = (name) => {
  return (
    <div className="Stops__item--name">
      <span>🚌 {name}</span>
    </div>
  )
}

const LineDestination = (longName) => {

  const destination = longName.split('-')[0]

  return (
    <div className="Stops__item--destination">
      <span>{destination}</span>
    </div>
  )
}

const Stop = ({stops}) => {
  console.log("stops", stops)


  return (
    <div className="Stops">
      { parseStops(stops).map(stopTime => (
        <div className="Stops__item" key={stopKey(stopTime)}>
          <div className="Stops__item--name">
            {LineName(stopTime.trip.route.shortName)}
            {LineDestination(stopTime.trip.route.longName)}
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
