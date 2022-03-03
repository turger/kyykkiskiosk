import 'whatwg-fetch'
import moment from 'moment'
const parseXml = require('xml2js').parseString

export const getLatestTemp = () => {
  return new Promise(resolve => {
    const hourAgoUtc = moment().subtract(1, "hour").utc().format();
    return fetch(`http://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::weather::simple&place=Saunalahti,Espoo&parameters=temperature,windspeedms&starttime=${hourAgoUtc}`)
      .then(res => res.text())
      .then(res => {
        parseXml(res, function (err, result) {
          const results = result["wfs:FeatureCollection"]["wfs:member"];
          const latest1 = results[results.length - 1];
          const latest2 = results[results.length - 2];

          const name1 = latest1["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"][0];
          const value1 = latest1["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0];

          const name2 = latest2["BsWfs:BsWfsElement"][0]["BsWfs:ParameterName"][0];
          const value2 = latest2["BsWfs:BsWfsElement"][0]["BsWfs:ParameterValue"][0];
          resolve({
            [name1]: value1,
            [name2]: value2,
          })
        });
      }).catch(err => {
        console.warn('Error getting current temp', err)
      })
  })
}

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
