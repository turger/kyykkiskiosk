const SECONDS_IN_DAY = 86400

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

const getStartOfDay = (time = new Date()) => {
  const newTime = new Date(time.getTime())
  newTime.setHours(0, 0, 0, 0)
  return newTime.getTime()
}

const getTimeInSeconds = (time = new Date()) => (time.getHours()*60*60) + (time.getMinutes()*60) + time.getSeconds()

export const minutesToDeparture = (stopTime, time = new Date()) => {
  const timeInSeconds = getTimeInSeconds(time)
  const startOfDayInSeconds = getStartOfDay(time) / 1000

  let arrivalTimeInSeconds
  if (stopTime.serviceDay > startOfDayInSeconds) {
    // if service day is next day
    arrivalTimeInSeconds = stopTime.realtimeArrival + SECONDS_IN_DAY
  } else if (stopTime.realtimeArrival-timeInSeconds > SECONDS_IN_DAY) {
    // else if stopTime.realtimeArrival is more than 24h, this happens between 00:00-06:00
    arrivalTimeInSeconds = stopTime.realtimeArrival - SECONDS_IN_DAY
  } else {
    arrivalTimeInSeconds = stopTime.realtimeArrival
  }

  const minutesToDeparture = Math.floor((arrivalTimeInSeconds - timeInSeconds) / 60)

  return minutesToDeparture
}
