import 'whatwg-fetch'

export const getFmiWeatherData = () => new Promise(resolve => {
  fetch('https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::forecast::hirlam::surface::point::simple&place=saunalahti,espoo&maxlocations=1')
    .then(res => {
      if (res.status !== 200) throw new Error(res.status)
      resolve(res.text())
    })
    .catch(err => {
      console.warn(err)
    })
})

const getCurrentTimestamp = () => {
  return Math.round(new Date().getTime() / 1000)
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

export const getBikes = (id) => doQuery(`
  {
    bikeRentalStation(id:"${id}") {
      stationId
      name
      bikesAvailable
      spacesAvailable
      lat
      lon
      allowDropoff
    }
  }`
).then(res => res.data.bikeRentalStation)

export const getSchedulesForStop = (stopId, startTime = getCurrentTimestamp()) =>
  doQuery(`
  {
  stop(id:"${stopId}"){
    name
    gtfsId
    patterns {
      name
      headsign
      route {
        longName
        shortName
      }
    }
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
          mode
        }
      }
    }
  }
}`
).then(res => res.data.stop)
