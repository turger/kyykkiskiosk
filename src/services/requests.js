import 'whatwg-fetch'
import Promise from 'bluebird'
const request = require('request-promise')
const moment = require('moment')
const parseXml = require('xml2js').parseString

export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY

import {STOP_MK} from '../constants'

export const getWeatherData = () => {
  return Promise.join(getForecast(), getLatestTemp(), (forecast, latestTemp) => {
    return {
      forecast: forecast,
      latestTemp: latestTemp
    }
  })
}

const getForecast = () => {
  return request("https://mtdgma05af.execute-api.eu-west-1.amazonaws.com/dev/hello")
    .catch(err => {
      console.warn('Error getting forecast', err)
    })
}

const getLatestTemp = () => {
  return new Promise(resolve => {
    const hourAgoUtc = moment().subtract(1, "hour").utc().format();
    return request(`http://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::simple&place=Saunalahti,Espoo&parameters=temperature&starttime=${hourAgoUtc}`)
      .then(res => {
        parseXml(res, function (err, result) {
          const results = result["wfs:FeatureCollection"]["wfs:member"];
          const latest = results[results.length - 1];
          const latestTemp = latest["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0];
          resolve(latestTemp)
        });
      }).catch(err => {
        console.warn('Error getting current temp', err)
      })
  })
}

const getCurrentTimestamp = () => {
  const date = new Date()
  const unixtimestamp = Math.round(date.getTime() / 1000)
  return unixtimestamp
}

const doQuery = query => new Promise(resolve => {
  fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/graphql'
    },
    body: query
  })
    .then(res => {
      if (res.status !== 200) throw new Error(res.status)
      resolve(res.json())
    })
    .catch(err => {
      console.warn(err)
      setTimeout(() => {
        resolve(doQuery(query))
      }, 10000)
    })
})

export const getStopIds = stopName => doQuery(`
  {
    stops (name: "${stopName}") {
      gtfsId
    }
  }`
).then(res => res.data.stops)

export const getStopRoutes = stopName => doQuery(`
  { stops (name: "${stopName}") {
    id
    name
    gtfsId
    routes
      {
        id
        longName
        shortName
      }
    }
  }`
).then(res => res.data.stops)

export const getSchedulesForStop = (stopId, startTime = getCurrentTimestamp()) =>
  doQuery(`
  {
  stop(id:"${stopId}"){
    name
    gtfsId
    stoptimesWithoutPatterns(
      startTime:"${startTime}",
      timeRange: 180000,
      numberOfDepartures:15
    ) {
      scheduledArrival
      scheduledDeparture
      realtimeArrival
      serviceDay
      trip {
        route {
          gtfsId
          longName
          shortName
        }
      }
    }
  }
}`
  ).then(res => res.data.stop).then(stop => {
    if (stop.gtfsId === STOP_MK) {
      const filteredStop = stop
      stop.stoptimesWithoutPatterns = stop.stoptimesWithoutPatterns.filter(stopTime => {
        return stopTime.trip.route.shortName !== '20N'
      })
      return filteredStop
    }
    return stop
  })
