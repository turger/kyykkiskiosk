import moment from 'moment'

const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()

export const getTimeIfMoreThan60min = (minutesToDeparture, departureTimestamp) => {
  if (minutesToDeparture >= 60) {
    const depDate = new Date(departureTimestamp * 1000)
    const hours = depDate.getUTCHours()
    const minutes = ('0' + depDate.getUTCMinutes()).slice(-2)
    return `${hours}:${minutes}`
  } else {
    return minutesToDeparture
  }
}

export const minutesToDeparture = (departureTimestamp, serviceDay, currDate = new Date()) => {
  const currDateInSeconds = (currDate.getHours()*60*60)+(currDate.getMinutes()*60)+currDate.getSeconds()
  const secondsInDay = 86400
  let minutesToDeparture = Math.floor((departureTimestamp-currDateInSeconds) / 60)
  // if service day is next day
  if (serviceDay > (currDate.setHours(0,0,0,0) / 1000)) {
    minutesToDeparture = Math.floor(((departureTimestamp+secondsInDay)-currDateInSeconds) / 60)
  // else if departureTimestamp is more than 24h, this happens between 00:00-06:00
  } else if (departureTimestamp-currDateInSeconds > secondsInDay) {
    minutesToDeparture = Math.floor(((departureTimestamp-secondsInDay)-currDateInSeconds) / 60)
  }
  return getTimeIfMoreThan60min(minutesToDeparture, departureTimestamp)
}

const parseXml = xml => {
  const forecast = []
  xml['wfs:FeatureCollection']['wfs:member'].forEach((memberElem) => {
    const forecastElem = memberElem['BsWfs:BsWfsElement'][0]
    const time = forecastElem['BsWfs:Time'][0]
    const paramName = forecastElem['BsWfs:ParameterName'][0].toLowerCase()
    const rawParamValue = forecastElem['BsWfs:ParameterValue'][0]
    const paramValue = isNaN(rawParamValue) ? rawParamValue: parseFloat(rawParamValue)
    const forecastItem = forecast.find(item => item.time === time)
    if (forecastItem !== undefined) {
      forecastItem[paramName] = paramValue
    } else {
      const paramObject = {
        time,
      }
      paramObject[paramName] = paramValue
      forecast.push(paramObject)
    }
  })
  return forecast
}

export const parseXmlWeatherData = xmlText =>
  new Promise((resolve, reject) => {
    xmlParser.parseString(xmlText, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(parseXml(result))
    })
  })

export const formatTime = timestamptxt => {
  const time = moment(timestamptxt).format("HH:mm")
  return time
}